"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleStatusMapper = handleStatusMapper;
function handleStatusMapper(status) {
    var _a;
    const statusMap = new Map([
        ["Reprovada", "Reprovado"],
        ["Aprovada", "Aprovado"],
        ["Pendente", "Em análise"],
        ["Cancelada", "Cancelado"],
    ]);
    return (_a = statusMap.get(status)) !== null && _a !== void 0 ? _a : status;
}
