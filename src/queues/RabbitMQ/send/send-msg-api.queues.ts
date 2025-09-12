import { connect, ChannelWrapper } from "amqp-connection-manager";
import { ConfirmChannel } from "amqplib";
import { formatDateHour } from "../../../utils/formatter";
import { clientSendToAPIDTO } from "../../../dtos/clients.dto";

const AMQP_URL = process.env.AMQP_URL!;
const QUEUE = "response_to_api";

// conexão única com retry automático
const connection = connect([`${AMQP_URL}?heartbeat=30`]);

connection.on("connect", () =>
  console.log("✅ Conectado ao RabbitMQ (Publisher API)")
);
connection.on("disconnect", (err) =>
  console.error("⚠️ Desconectado. Tentando reconectar...", err?.err?.message)
);

// canal persistente
const channelWrapper: ChannelWrapper = connection.createChannel({
  json: true,
  setup: async (channel: ConfirmChannel) => {
    await channel.assertQueue(QUEUE, { durable: true });
  },
});

export async function sendMessageToAPI(client: clientSendToAPIDTO): Promise<void> {
  const dataHora = new Date();

  try {

    await channelWrapper.sendToQueue(QUEUE, client, {
      persistent: true,
    });

    console.info(
      `✅ ${formatDateHour(
        dataHora
      )} - Retorno da automação enviado para a API com sucesso!`
    );
  } catch (error) {
    console.error(
      `❌ ${formatDateHour(
        dataHora
      )} - Erro ao enviar retorno da automação: ${error}`
    );
  }
}
