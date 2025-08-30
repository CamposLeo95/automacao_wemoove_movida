export class Client {
	constructor(
		private client_id: string,
		private name: string,
		private cpf: string,
		private phone: string,
		private email: string,
	) {}

	getId() {
		return this.client_id;
	}

	getName() {
		return this.name;
	}

	getCpf() {
		return this.cpf;
	}

	getPhone() {
		return this.phone;
	}

	getEmail() {
		return this.email;
	}

	setName(name: string) {
		this.name = name;
	}

	setPhone(phone: string) {
		this.phone = phone;
	}

	setEmail(email: string) {
		this.email = email;
	}
}
