"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
class Client {
    constructor(client_id, name, cpf, phone, email) {
        this.client_id = client_id;
        this.name = name;
        this.cpf = cpf;
        this.phone = phone;
        this.email = email;
    }
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
    setName(name) {
        this.name = name;
    }
    setPhone(phone) {
        this.phone = phone;
    }
    setEmail(email) {
        this.email = email;
    }
}
exports.Client = Client;
