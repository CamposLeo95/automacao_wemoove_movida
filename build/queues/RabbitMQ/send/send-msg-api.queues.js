"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageToAPI = sendMessageToAPI;
const amqplib_1 = __importDefault(require("amqplib"));
const formatter_1 = require("../../../utils/formatter");
const AMQP_URL = process.env.AMQP_URL;
const QUEUE = "response_to_api";
const dataHora = new Date();
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function sendMessageToAPI(client) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!AMQP_URL) {
            return;
        }
        try {
            const connection = yield amqplib_1.default.connect(`${AMQP_URL}?heartbeat=30`);
            const channel = yield connection.createChannel();
            const message = JSON.stringify(client);
            yield channel.assertQueue(AMQP_URL, { durable: true });
            channel.sendToQueue(QUEUE, Buffer.from(message));
            console.info(`✅ ${(0, formatter_1.formatDateHour)(dataHora)} - Retorno da automação enviado para a API com sucesso!`);
            setTimeout(() => {
                connection.close();
            }, 500);
        }
        catch (error) {
            console.error(`❌ ${(0, formatter_1.formatDateHour)(dataHora)} - Retorno da automação enviado para a API com erro: ${error}`);
        }
    });
}
