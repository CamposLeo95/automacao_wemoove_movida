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
exports.App = void 0;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const received_msg_api_queues_1 = require("./queues/RabbitMQ/received/received-msg-api.queues");
const StartBrowser_service_1 = require("./service/StartBrowser.service");
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.initApp();
    }
    initApp() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initBrowser();
            this.middlewares();
            this.queues();
        });
    }
    middlewares() { }
    queues() {
        (0, received_msg_api_queues_1.receivedMessageAPI)(this.wsEndpoint);
    }
    initBrowser() {
        return __awaiter(this, void 0, void 0, function* () {
            const browserInstance = yield StartBrowser_service_1.StartBrowser.getInstance();
            this.wsEndpoint = browserInstance.getWsEndpoint();
        });
    }
}
exports.App = App;
exports.default = new App().app;
