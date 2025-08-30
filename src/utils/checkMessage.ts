export function identifyStatus(mensagem: string): string {
	const lower = mensagem.toLowerCase();

	if (/prospect.*ativo.*não possui.*proposta/.test(lower)) {
		return "Puxar";
	}

	if (/em atendimento.*localiza.*meoo/.test(lower)) {
		return "Time localiza";
	}

	if (/prospect.*ativo.*proposta.*vigente/.test(lower)) {
		return "Aprovado com proposta vigente";
	}

	if (/cliente.*ativo/.test(lower)) {
		return "Cliente ativo";
	}

	return "Status Desconhecido";
}
