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
exports.StartBrowser = void 0;
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
class StartBrowser {
    constructor() { }
    static getInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!StartBrowser.instance) {
                StartBrowser.instance = new StartBrowser();
                yield StartBrowser.instance.initBrowser();
            }
            return StartBrowser.instance;
        });
    }
    initBrowser() {
        return __awaiter(this, void 0, void 0, function* () {
            this.browser = yield puppeteer_extra_1.default.launch({
                headless: "new", // ou true se não quiser cast
                executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
                args: [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-blink-features=AutomationControlled",
                    "--window-size=1280,2000",
                ],
                timeout: 60000,
            });
            const page = yield this.browser.newPage();
            // User-Agent e headers realistas
            yield page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
                "(KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36");
            yield page.setExtraHTTPHeaders({
                "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
            });
            this.wsEndpoint = this.browser.wsEndpoint();
        });
    }
    getWsEndpoint() {
        return this.wsEndpoint;
    }
}
exports.StartBrowser = StartBrowser;
StartBrowser.instance = null;
