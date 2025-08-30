import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import type { Browser } from "puppeteer";

puppeteer.use(StealthPlugin());

export class StartBrowser {
  private static instance: StartBrowser | null = null;
  private browser!: Browser;
  private wsEndpoint!: string;

  private constructor() {}

  static async getInstance() {
    if (!StartBrowser.instance) {
      StartBrowser.instance = new StartBrowser();
      await StartBrowser.instance.initBrowser();
    }
    return StartBrowser.instance;
  }

  private async initBrowser() {
    this.browser = await puppeteer.launch({
      headless: "new" as any, // ou true se não quiser cast
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
        "--window-size=1280,2000",
      ],
      timeout: 60000,
    });

    const page = await this.browser.newPage();

    // User-Agent e headers realistas
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    );

    await page.setExtraHTTPHeaders({
      "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    });

    this.wsEndpoint = this.browser.wsEndpoint();
  }

  getWsEndpoint() {
    return this.wsEndpoint;
  }
}
