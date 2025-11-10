import { connect, ChannelWrapper } from "amqp-connection-manager";
import { ConfirmChannel, ConsumeMessage } from "amqplib";
import { Client } from "../../../domain/entities/client.entity";
import { AutomationMovida } from "../../../service/AutomationMovida.service";
import { StartBrowser } from "../../../service/StartBrowser.service";
import { Browser } from "puppeteer";

const AMQP_URL = process.env.AMQP_URL!;
const EXCHANGE = "clientes_exchange";
const QUEUE = "movida";

let channelWrapper: ChannelWrapper;

export async function receivedMessageAPI() {
  if (!AMQP_URL) {
    console.error("❌ AMQP_URL não definida.");
    return;
  }

  const connection = connect([`${AMQP_URL}?heartbeat=30`]);

  connection.on("connect", () =>
    console.log("✅ Conectado ao RabbitMQ (Movida Consumer)")
  );
  
  connection.on("disconnect", (err) =>
    console.error("⚠️ Desconectado. Tentando reconectar...", err?.err?.message)
  );

  channelWrapper = connection.createChannel({
    json: true,
    setup: async (channel: ConfirmChannel) => {
      await channel.assertExchange(EXCHANGE, "fanout", { durable: true });
      await channel.assertQueue(QUEUE, { durable: true });
      await channel.bindQueue(QUEUE, EXCHANGE, "");
      channel.prefetch(1);

      console.log("📥 Aguardando novos clientes em Movida...");

      await channel.consume(
        QUEUE,
        async (msg: ConsumeMessage | null) => {
        if (!msg) return;

        let browser: Browser | null = null;

        try {
          const data = JSON.parse(msg.content.toString());

          const { client_id, name, cpf, phone, email } = data;
          const client = new Client(client_id, name, cpf, phone, email);
            console.log("🔑 Abrindo Browser");
            browser = await StartBrowser.launchBrowser();
            const page = (await browser.pages())[0] || (await browser.newPage());

            console.log(`🔄️ Iniciando automação de: ${client.getName()}`);
            const automacao = new AutomationMovida(page, client);
            await automacao.execute();

            channel.ack(msg);
          } catch (err) {
              console.error("❌ Erro processando:", err);
              channel!.ack(msg);
          } finally {
            if (browser) {
              console.log("🔒 Fechando Browser");
              await browser.close();
            }
          }
        },
        { noAck: false }
      );
    },
  });
}
