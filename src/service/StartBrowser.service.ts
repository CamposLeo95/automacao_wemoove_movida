import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import type { Browser } from "puppeteer";

puppeteer.use(StealthPlugin());

const PROXY_URL  = process.env.PROXY_URL;
const PROXY_USER = process.env.PROXY_USER;
const PROXY_PASS = process.env.PROXY_PASS;

export class StartBrowser {
  static async launchBrowser(): Promise<Browser> {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      // SITE DE PROXY DECODO - https://dashboard.decodo.com/residential-proxies/proxy-setup
      args: [
        ...(PROXY_URL ? [`--proxy-server=${PROXY_URL}`] : []),
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-blink-features=AutomationControlled",
        "--window-size=1280,2000",
      ],
      timeout: 60000,
    });

    const pages = await browser.pages();
    await Promise.all(pages.map(p => p.close()));

    const page = await browser.newPage();

    if (PROXY_USER && PROXY_PASS) {
      await page.authenticate({ username: PROXY_USER, password: PROXY_PASS });
    }

    // Bloqueia recursos desnecessários para economizar banda do proxy
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const type = req.resourceType();
      const url  = req.url();
      const bloqueado =
        type === 'image'      ||
        type === 'media'      ||
        type === 'font'       ||
        type === 'stylesheet' ||
        url.includes('youtube.com')        ||
        url.includes('googletagmanager')   ||
        url.includes('google-analytics')   ||
        url.includes('analytics.google')   ||
        url.includes('doubleclick.net')    ||
        url.includes('facebook.net')       ||
        url.includes('facebook.com')       ||
        url.includes('clarity.ms')         ||
        url.includes('securiti.ai');
      if (bloqueado) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    );

    await page.setExtraHTTPHeaders({
      "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    });

    return browser;
  }
}
