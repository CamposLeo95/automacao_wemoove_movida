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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomationMovida = void 0;
const promises_1 = require("node:timers/promises");
const send_msg_api_queues_1 = require("../queues/RabbitMQ/send/send-msg-api.queues");
const handleStatusMapper_1 = require("../utils/handleStatusMapper");
const URL_MOVIDA_STATUS = process.env.URL_MOVIDA_STATUS;
const AMBIENTE = Boolean(+process.env.TEST);
const token = process.env.TOKEN;
const tokenName = process.env.TOKEN_NAME;
const acessos = process.env.TOKEN_ACESSOS;
const userId = process.env.TOKEN_USER_ID;
const saleCode = process.env.SALE_CODE || "";
const B2B_LOGIN_DATA = "\"{\\\"token\\\":\\\"" + token +
    "\\\",\\\"portal\\\":{\\\"Nome\\\":\\\"" + tokenName +
    "\\\",\\\"acessos\\\":\\\"" + acessos +
    "\\\",\\\"WUsuarioID\\\":\\\"" + userId + "\\\"}}\"";
class AutomationMovida {
    constructor(page, client) {
        this.page = page;
        this.client = client;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.page.setViewport({ width: 1280, height: 2000 });
                yield this.page.goto(`${"https://www.movidacarroporassinatura.com.br/lp/carro-por-assinatura/"}`, { waitUntil: 'networkidle2' });
                const inputName = yield this.page.waitForSelector("input[name=name]");
                if (!inputName) {
                    throw new Error("❌ Erro ao buscar o campo CPF!");
                }
                yield (0, promises_1.setTimeout)(5000);
                yield inputName.type(this.client.getName());
                const inputCpf = yield this.page.waitForSelector("input[name=cpf]");
                if (!inputCpf) {
                    throw new Error("❌ Erro ao buscar o campo CPF!");
                }
                yield inputCpf.type(this.client.getCpf());
                const inputPhone = yield this.page.waitForSelector("input[name=phone]");
                if (!inputPhone) {
                    throw new Error("❌ Erro ao buscar o campo CPF!");
                }
                yield inputPhone.type("31999999999");
                const inputEmail = yield this.page.waitForSelector("input[name=email]");
                if (!inputEmail) {
                    throw new Error("❌ Erro ao buscar o campo CPF!");
                }
                yield inputEmail.type("assinatura321@gmail.com");
                yield this.page.$eval('p.clickVendedor', el => el.click());
                yield this.page.type('#VendedorID', saleCode);
                const buttonSend = yield this.page.waitForSelector('#btnSend');
                if (!buttonSend) {
                    throw new Error("❌ Erro ao buscar o campo CPF!");
                }
                yield buttonSend.evaluate(el => el.scrollIntoView({ block: 'center' }));
                yield buttonSend.click();
                yield this.page.waitForSelector('.swal2-popup', { timeout: 5000 }).catch(() => null);
                yield (0, promises_1.setTimeout)(20000);
                const text = yield this.page.$eval('.swal2-title', el => el.textContent || '');
                if (text.includes('Erro ao enviar contato')) {
                    yield (0, promises_1.setTimeout)(5000);
                    console.log("Erro 1");
                    const clientSendToAPI = {
                        client_id: this.client.getId(),
                        approved_movida: "Bloqueado",
                    };
                    yield (0, send_msg_api_queues_1.sendMessageToAPI)(clientSendToAPI);
                    console.log('❌ Erro detectado');
                    yield this.page.goto(`${"https://www.movidacarroporassinatura.com.br/lp/carro-por-assinatura/"}`, { waitUntil: 'networkidle2' });
                    return;
                }
                console.log("🔄️ Fazendo a solicitacao...");
                yield (0, promises_1.setTimeout)(120000);
                console.log("➡️ Navegando para relatorios...");
                yield this.getStatus();
                console.log("➡️ Retornando para solicitacao");
                yield this.page.goto(`${"https://www.movidacarroporassinatura.com.br/lp/carro-por-assinatura/"}`, { waitUntil: 'networkidle2' });
                return;
            }
            catch (error) {
                console.log("Erro 2");
                const clientSendToAPI = {
                    client_id: this.client.getId(),
                    approved_movida: "Bloqueado",
                };
                yield (0, send_msg_api_queues_1.sendMessageToAPI)(clientSendToAPI);
            }
        });
    }
    insertToken() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.goto(`${URL_MOVIDA_STATUS}`, { waitUntil: 'networkidle2' });
            yield this.page.evaluate((raw) => {
                try {
                    const obj = JSON.parse(raw);
                    localStorage.setItem('b2b-login-data', JSON.stringify(obj));
                }
                catch (_a) {
                    localStorage.setItem('b2b-login-data', raw);
                }
            }, B2B_LOGIN_DATA);
            yield this.page.reload({ waitUntil: 'networkidle0' });
        });
    }
    getStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, promises_1.setTimeout)(10000);
            yield this.insertToken();
            yield this.page.goto(`${URL_MOVIDA_STATUS}/relatorios/pedidos`, {
                waitUntil: 'networkidle2',
                timeout: 60000
            });
            yield (0, promises_1.setTimeout)(30000);
            const { data_criacao, status_reserva, clienteOnSite } = yield this.page.evaluate(() => {
                var _a;
                const table = (_a = document.querySelector("movida-table")) === null || _a === void 0 ? void 0 : _a.shadowRoot;
                if (!table)
                    return { data_criacao: null, status_reserva: null, clienteOnSite: null };
                const getText = (sel) => { var _a, _b; return ((_b = (_a = table.querySelector(sel)) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || null; };
                return {
                    data_criacao: getText("tbody.table__body tr:nth-child(1) td:nth-child(2)"),
                    status_reserva: getText("tbody.table__body tr:nth-child(1) td:nth-child(4)"),
                    clienteOnSite: getText("tbody.table__body tr:nth-child(1) td:nth-child(13)")
                };
            });
            const clientSendToAPI = {
                client_id: this.client.getId(),
                approved_movida: (0, handleStatusMapper_1.handleStatusMapper)(status_reserva !== null && status_reserva !== void 0 ? status_reserva : "") || "",
            };
            console.log(`✅ Enviando status para a API: ${(0, handleStatusMapper_1.handleStatusMapper)(status_reserva !== null && status_reserva !== void 0 ? status_reserva : "")}`);
            // await sendMessageToAPI(clientSendToAPI);
        });
    }
}
exports.AutomationMovida = AutomationMovida;
