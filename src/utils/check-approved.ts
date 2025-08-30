export function checkApproved(texto: string) {
	const status = [
		"Aprovado",
		"Pré-aprovado",
		"Reprovado",
		"Aprovado com restrição",
	];

	for (const s of status) {
		if (texto.startsWith(s)) {
			const valorMatch = texto.match(/R\$ ?([\d.]+)/);
			const valor = valorMatch ? valorMatch[1].replace(/\./g, "") : null;

			if (s === "Aprovado") {
				return {
					status: s,
					valor: valor ? valor : null,
				};
			}

			if (s === "Aprovado com restrição") {
				return {
					status: s,
					valor: valor ? valor : null,
				};
			}

			return {
				status: s,
				valor: null,
			};
		}
	}

	return {
		status: null,
		valor: null,
	};
}
