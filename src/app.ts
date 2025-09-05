import "dotenv/config";
import express from "express";

import { receivedMessageAPI } from "./queues/RabbitMQ/received/received-msg-api.queues";
export class App {
	public app = express();
	public wsEndpoint!: string;
	constructor() {
		this.initApp();
	}
	async initApp() {
		this.middlewares();
		this.queues();
	}

	private middlewares() {}
	private queues() {
		receivedMessageAPI();
	}
}

export default new App().app;
