import amqp from "amqplib";
import { Client } from "../../../domain/entities/client.entity";
import { Connection } from "../../../service/Connection.service";
import { AutomationMovida } from "../../../service/AutomationMovida.service";

const AMQP_URL = process.env.AMQP_URL;
const EXCHANGE = "clientes_exchange";
const QUEUE = "movida";

export async function receivedMessageAPI(wsEndpoint: string) {
  if (!AMQP_URL) {
    return;
  }
  try {

    const connection = await amqp.connect(`${AMQP_URL}?heartbeat=30`);
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE, "fanout", { durable: true });
    await channel.assertQueue(QUEUE, { durable: true });
    await channel.bindQueue(QUEUE, EXCHANGE, "");

    console.log(`📥 Aguardando novos clientes em Movida...`);
    await channel.prefetch(1);
    channel.consume(
      QUEUE,
      async (msg) => {
        console.log
        if (msg) {
          try {
            const contentString = msg.content.toString();
            const { client_id, name, cpf, phone, email } = JSON.parse(contentString);

            const client = new Client(client_id, name, cpf, phone, email);
            const connection = new Connection(wsEndpoint);
            const page = await connection.execute();
            if (!page) {
              throw new Error("Não foi possível obter a página do Puppeteer.");
            }
            console.log(`🔄️ Iniciando automacao de: ${client.getName()}`)
            const automacao = new AutomationMovida(page, client);
            await automacao.execute();

            channel.ack(msg); 
          } catch (err) {
            channel.ack(msg); 
            console.error("❌ Erro ao processar cliente em Movida:", err);
          }
        }
      },
      { noAck: false }, 
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Erro ao receber mensagem:", error.message);
    }
    console.error("❌ Erro ao receber mensagem:", error);
  }
}
