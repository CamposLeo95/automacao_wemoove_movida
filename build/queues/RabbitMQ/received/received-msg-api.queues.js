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
exports.receivedMessageAPI = receivedMessageAPI;
const amqplib_1 = __importDefault(require("amqplib"));
const client_entity_1 = require("../../../domain/entities/client.entity");
const Connection_service_1 = require("../../../service/Connection.service");
const AutomationMovida_service_1 = require("../../../service/AutomationMovida.service");
const AMQP_URL = process.env.AMQP_URL;
const EXCHANGE = "clientes_exchange";
const QUEUE = "movida";
function receivedMessageAPI(wsEndpoint) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!AMQP_URL) {
            return;
        }
        try {
            const connection = yield amqplib_1.default.connect(`${AMQP_URL}?heartbeat=30`);
            const channel = yield connection.createChannel();
            yield channel.assertExchange(EXCHANGE, "fanout", { durable: true });
            yield channel.assertQueue(QUEUE, { durable: true });
            yield channel.bindQueue(QUEUE, EXCHANGE, "");
            console.log(`📥 Aguardando novos clientes em Movida...`);
            yield channel.prefetch(1);
            channel.consume(QUEUE, (msg) => __awaiter(this, void 0, void 0, function* () {
                console.log;
                if (msg) {
                    try {
                        const contentString = msg.content.toString();
                        const { client_id, name, cpf, phone, email } = JSON.parse(contentString);
                        const client = new client_entity_1.Client(client_id, name, cpf, phone, email);
                        const connection = new Connection_service_1.Connection(wsEndpoint);
                        const page = yield connection.execute();
                        if (!page) {
                            throw new Error("Não foi possível obter a página do Puppeteer.");
                        }
                        console.log(`🔄️ Iniciando automacao de: ${client.getName()}`);
                        const automacao = new AutomationMovida_service_1.AutomationMovida(page, client);
                        yield automacao.execute();
                        channel.ack(msg);
                    }
                    catch (err) {
                        console.error("❌ Erro ao processar cliente em Movida:", err);
                    }
                }
            }), { noAck: false });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("❌ Erro ao receber mensagem:", error.message);
            }
            console.error("❌ Erro ao receber mensagem:", error);
        }
    });
}
