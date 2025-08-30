import amqp from "amqplib";
import { formatDateHour } from "../../../utils/formatter";
import { clientSendToAPIDTO } from "../../../dtos/clients.dto";


const AMQP_URL = process.env.AMQP_URL;
const QUEUE = "response_to_api";
const dataHora = new Date();

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function sendMessageToAPI(client: clientSendToAPIDTO) {
	if (!AMQP_URL) {
		return;
	}
	try {
		const connection = await amqp.connect(`${AMQP_URL}?heartbeat=30`);
		const channel = await connection.createChannel();
		const message = JSON.stringify(client);
		await channel.assertQueue(AMQP_URL, { durable: true });

		channel.sendToQueue(QUEUE, Buffer.from(message));

		console.info(
			`✅ ${formatDateHour(dataHora)} - Retorno da automação enviado para a API com sucesso!`,
		);

		setTimeout(() => {
			connection.close();
		}, 500);
		
	} catch (error) {
		console.error(
			`❌ ${formatDateHour(dataHora)} - Retorno da automação enviado para a API com erro: ${error}`
		);
	}
}
