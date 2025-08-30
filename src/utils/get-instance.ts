import { StartBrowser } from "../service/StartBrowser.service";


export default async function getWsEndpoint() {
	const browserInstance = await StartBrowser.getInstance();
	const ws = await browserInstance.getWsEndpoint();

	return ws;
}
