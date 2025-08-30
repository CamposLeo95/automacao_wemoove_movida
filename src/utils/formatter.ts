export const formatPhone = (phone: string): string => {
	const digits = phone.replace(/\D/g, "");

	const ddd = digits.slice(0, 2);
	let number = digits.slice(2);

	if (number.length === 8) {
		number = `9${number}`;
	}

	if (number.length !== 9) {
		throw new Error("Formato de número inválido");
	}
	return `(${ddd})${number.slice(0, 5)}-${number.slice(5)}`;
};

export function formatDateHour(date: Date): string {
	const horas = String(date.getHours()).padStart(2, "0");
	const minutos = String(date.getMinutes()).padStart(2, "0");
	const dia = String(date.getDate()).padStart(2, "0");
	const mes = String(date.getMonth() + 1).padStart(2, "0"); // mês começa em 0
	const ano = date.getFullYear();

	return `${horas}:${minutos} - ${dia}/${mes}/${ano}`;
}

