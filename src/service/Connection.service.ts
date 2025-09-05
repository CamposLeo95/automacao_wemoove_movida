import puppeteer, { Browser, Page } from "puppeteer";
const AMBIENTE_TEST = Boolean(+(process.env.AMBIENTE_TEST as string)) ;
const WS_DEV = process.env.WS_DEV as string;
export class Connection {
  private browser!: Browser;
  private page!: Page;

  constructor(private wsEndpoint: string) {}

  async execute() {
		try {
			this.browser = await puppeteer.connect({
				browserWSEndpoint: AMBIENTE_TEST ? WS_DEV : this.wsEndpoint,
				protocolTimeout: 60000,
			});
	
			const pages = await this.browser.pages();
			this.page = pages.length ? pages[0] : await this.browser.newPage();
			console.log("Conexao aberta!")
			return this.page;
			
		} catch (error) {
			console.error("❌ Erro ao conectar ao Puppeteer:", error);
		}
	}

	async disconnect() {
		try {
			if (this.page && !this.page.isClosed()) {
				await this.page.close();
			}
			if (this.browser) {
				await this.browser.disconnect();
			}
			console.log("🔒Conexao fechada!")
		} catch (error) {
			console.error("❌ Erro ao desconectar Puppeteer:", error);
		}
	}
}