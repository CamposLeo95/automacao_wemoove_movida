import "dotenv/config";
import express from "express";

import { receivedMessageAPI } from "./queues/RabbitMQ/received/received-msg-api.queues";
import { StartBrowser } from "./service/StartBrowser.service";
export class App {
	public app = express();
	public wsEndpoint!: string;
	constructor() {
		this.initApp();
	}

	async initApp() {
		await this.initBrowser();
		this.middlewares();
		this.queues();
	}

	private middlewares() {}

	private queues() {
		receivedMessageAPI(this.wsEndpoint);
	}

	async initBrowser() {
		const browserInstance = await StartBrowser.getInstance();
		this.wsEndpoint = browserInstance.getWsEndpoint();
	}
}

export default new App().app;
