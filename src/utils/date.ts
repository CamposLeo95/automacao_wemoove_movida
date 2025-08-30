export function currentDate(): string {
	const now = new Date();

	const horas = now.toLocaleString('pt-BR', {
		timeZone: 'America/Sao_Paulo',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	});
	const dia = now.toLocaleString('pt-BR', {
		timeZone: 'America/Sao_Paulo',
		day: '2-digit',
	});
	const mes = now.toLocaleString('pt-BR', {
		timeZone: 'America/Sao_Paulo',
		month: '2-digit',
	});
	const ano = now.toLocaleString('pt-BR', {
		timeZone: 'America/Sao_Paulo',
		year: 'numeric',
	});

	return `${horas} - ${dia}/${mes}/${ano}`;
}
