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
exports.Connection = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const AMBIENTE_TEST = Boolean(+process.env.AMBIENTE_TEST);
const WS_DEV = process.env.WS_DEV;
class Connection {
    constructor(wsEndpoint) {
        this.wsEndpoint = wsEndpoint;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.browser = yield puppeteer_1.default.connect({
                    browserWSEndpoint: AMBIENTE_TEST ? WS_DEV : this.wsEndpoint,
                    protocolTimeout: 60000,
                });
                const pages = yield this.browser.pages();
                this.page = pages.length ? pages[0] : yield this.browser.newPage();
                return this.page;
            }
            catch (error) {
                console.error("❌ Erro ao conectar ao Puppeteer:", error);
            }
        });
    }
}
exports.Connection = Connection;
