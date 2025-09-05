import type { Page } from "puppeteer";
import type { Client } from "../domain/entities/client.entity";
import { setTimeout } from "node:timers/promises";
import { clientSendToAPIDTO } from "../dtos/clients.dto";
import { sendMessageToAPI } from "../queues/RabbitMQ/send/send-msg-api.queues";
import { handleStatusMapper } from "../utils/handleStatusMapper";
import { writeFileSync } from "node:fs";
const URL_MOVIDA_STATUS = process.env.URL_MOVIDA_STATUS as string;
const AMBIENTE = Boolean(+(process.env.TEST as string)) ;

const token = process.env.TOKEN;
const tokenName = process.env.TOKEN_NAME;
const acessos = process.env.TOKEN_ACESSOS;
const userId = process.env.TOKEN_USER_ID;
const saleCode = process.env.SALE_CODE || "";

const B2B_LOGIN_DATA =
  "\"{\\\"token\\\":\\\"" + token +
  "\\\",\\\"portal\\\":{\\\"Nome\\\":\\\"" + tokenName +
  "\\\",\\\"acessos\\\":\\\"" + acessos +
  "\\\",\\\"WUsuarioID\\\":\\\"" + userId + "\\\"}}\"";

export class AutomationMovida {
	private page: Page;
	private client: Client;

	constructor(page: Page, client: Client) {
		this.page = page;
		this.client = client;
	}

	async execute() {
		try {
			await this.page.setViewport({ width: 1280, height: 2000 });
			await this.page.goto(`${"https://www.movidacarroporassinatura.com.br/lp/carro-por-assinatura/"}`, { waitUntil: 'networkidle2' });
			const inputName = await this.page.waitForSelector("input[name=name]");
			if (!inputName) {
				throw new Error("❌ Erro ao buscar o campo CPF!");
			}
			await setTimeout(5000); 
			await inputName.type(this.client.getName());

			const inputCpf = await this.page.waitForSelector("input[name=cpf]");
			if (!inputCpf) {
				throw new Error("❌ Erro ao buscar o campo CPF!");
			}
			await inputCpf.type(this.client.getCpf());


			const inputPhone = await this.page.waitForSelector("input[name=phone]");
			if (!inputPhone) {
				throw new Error("❌ Erro ao buscar o campo CPF!");
			}
			await inputPhone.type("31999999999");

			const inputEmail = await this.page.waitForSelector("input[name=email]");
			if (!inputEmail) {
				throw new Error("❌ Erro ao buscar o campo CPF!");
			}
			await inputEmail.type("assinatura321@gmail.com");

			await this.page.$eval('p.clickVendedor', el => (el as HTMLElement).click());

			await this.page.type('#VendedorID', saleCode);

			const buttonSend = await this.page.waitForSelector('#btnSend');
			if (!buttonSend) {
				throw new Error("❌ Erro ao buscar o campo CPF!");
			}
			await buttonSend.evaluate(el => el.scrollIntoView({ block: 'center' }));
			await buttonSend.click();


			await this.page.waitForSelector('.swal2-popup', { timeout: 5000 }).catch(() => null);

			await setTimeout(20000)

			const text = await this.page.$eval('.swal2-title', el => el.textContent || '');
			console.log(text)
			if (text.includes('Erro ao enviar contato')) {
				await setTimeout(5000)
				console.log("Erro 1")
				const clientSendToAPI: clientSendToAPIDTO = {
					client_id: this.client.getId(),
					approved_movida: "Bloqueado",
				};
				await sendMessageToAPI(clientSendToAPI);
				console.log('❌ Erro detectado');
				await this.page.goto(`${"https://www.movidacarroporassinatura.com.br/lp/carro-por-assinatura/"}`, { waitUntil: 'networkidle2' });
				return
			} 
			console.log("🔄️ Fazendo a solicitacao...")
			await setTimeout(120000)
			console.log("➡️ Navegando para relatorios...")
			await this.getStatus()
			console.log("➡️ Retornando para solicitacao")
			await this.page.goto(`${"https://www.movidacarroporassinatura.com.br/lp/carro-por-assinatura/"}`, { waitUntil: 'networkidle2' });
			return 

		} catch (error) {
				console.log("Erro 2")
			const clientSendToAPI: clientSendToAPIDTO = {
					client_id: this.client.getId(),
					approved_movida: "Bloqueado",
				};
			await sendMessageToAPI(clientSendToAPI);

		}
			
	}

	async insertToken() {
		await this.page.goto(`${URL_MOVIDA_STATUS}`, { waitUntil: 'networkidle2' });
		await this.page.evaluate((raw) => {
			try {
				const obj = JSON.parse(raw);
				localStorage.setItem('b2b-login-data', JSON.stringify(obj));
			} catch {
				localStorage.setItem('b2b-login-data', raw);
				}
		}, B2B_LOGIN_DATA);
		await this.page.reload({ waitUntil: 'networkidle0' });
	}


async getStatus() {
  await setTimeout(10000);
  await this.insertToken();

  await this.page.goto(`${URL_MOVIDA_STATUS}/relatorios/pedidos`, { 
    waitUntil: 'networkidle2',
    timeout: 60_000
  });

	await setTimeout(30000);

	const { data_criacao, status_reserva, clienteOnSite } = await this.page.evaluate(() => {
		const table = document.querySelector("movida-table")?.shadowRoot;
		if (!table) return { data_criacao: null, status_reserva: null, clienteOnSite: null };
		const getText = (sel: string) =>
			table.querySelector(sel)?.textContent?.trim() || null;

		return {
			data_criacao: getText("tbody.table__body tr:nth-child(1) td:nth-child(2)"),
			status_reserva: getText("tbody.table__body tr:nth-child(1) td:nth-child(4)"),
			clienteOnSite: getText("tbody.table__body tr:nth-child(1) td:nth-child(13)")
		};
	});

  const clientSendToAPI: clientSendToAPIDTO = {
    client_id: this.client.getId(),
    approved_movida: handleStatusMapper(status_reserva ?? "") || "",
  };

  await sendMessageToAPI(clientSendToAPI);
}



}
