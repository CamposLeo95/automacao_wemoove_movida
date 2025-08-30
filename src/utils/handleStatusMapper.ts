export function handleStatusMapper(status: string) {
	const statusMap = new Map<string, string>([
		["Reprovada", "Reprovado"],
		["Aprovada", "Aprovado"],
		["Pendente", "Em análise"],
		["Cancelada", "Cancelado"],
	]);
		return statusMap.get(status) ?? status
}