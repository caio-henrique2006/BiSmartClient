const mysql = require('mysql2/promise');

class DB {
    #connection_data = {
        host: "localhost",
        user: "root",
        password: "",
        database: "geral"
    }

    // async getAmountClients() {
    //     const conn = await this.#connect();
    //     let [rows, fields] = await conn.query("SELECT count(codigo) FROM cliente");
    //     return rows;
    // }

    async getData(data_inicio, data_fim) {
        const arr = [];
        arr.push(await this.getValorVendas(data_inicio, data_fim));
        arr.push(await this.getValorCompras(data_inicio, data_fim));
        arr.push(await this.getQuantidadeVendas(data_inicio, data_fim));
        // arr.push(await this.getQuantidadeItensVendidos());
        // arr.push(await this.getQuantidadeItensComprados());
        arr.push(await this.getTicketMedio(data_inicio, data_fim));
        return arr;
    }

    async getValorVendas(data_inicio, data_fim) {
        const conn = await this.#connect();
        console.log("SELECT sum(totgeral) FROM movvendas WHERE cancelada = 'N' AND emissao BETWEEN '" + data_inicio + "' AND '" + data_fim + "';");
        let [rows, fields] = await conn.query("SELECT sum(totgeral) FROM movvendas WHERE cancelada = 'N' AND emissao BETWEEN '" + data_inicio + "' AND '" + data_fim + "';");
        return rows;
    }

    async getValorCompras(data_inicio, data_fim) {
        const conn = await this.#connect();
        let [rows, fields] = await conn.query("SELECT SUM(totgeral) FROM MOVENT WHERE EMISSAO BETWEEN '" + data_inicio + "' AND '" + data_fim + "' AND CANCELADA !='S';");
        return rows;
    }

    async getQuantidadeVendas(data_inicio, data_fim) {
        const conn = await this.#connect();
        let [rows, fields] = await conn.query("SELECT count(docum) FROM movvendas WHERE cancelada = 'N' AND emissao BETWEEN '" + data_inicio + "' AND '" + data_fim + "';");
        return rows;
    }

    async getQuantidadeItensVendidos(data_inicio, data_fim) {
        const conn = await this.#connect();
        let [rows, fields] = await conn.query("SELECT COUNT(PRODUTO) FROM MOVVENDASP WHERE natoper != 5202 AND natoper != 5411 AND EMISSAO BETWEEN '" + data_inicio + "' AND '" + data_fim + "' AND DOCUM IN (SELECT DOCUM FROM MOVVENDAS WHERE CANCELADA = '' AND EMISSAO BETWEEN '" + data_inicio + "' AND '" + data_fim + "');");
        return rows;
    }

    async getQuantidadeItensComprados(data_inicio, data_fim) {
        const conn = await this.#connect();
        let [rows, fields] = await conn.query("SELECT COUNT(PRODUTO) FROM MOVENTP WHERE emissao BETWEEN '" + data_inicio + "' AND '" + data_fim + "' AND DOCUM IN (SELECT DOCUM FROM MOVVENDAS WHERE CANCELADA !='S' AND EMISSAO BETWEEN '" + data_inicio + "' AND '" + data_fim + "');");
        return rows;
    }

    async getTicketMedio(data_inicio, data_fim) {
        const conn = await this.#connect();
        let [rows, fields] = await conn.query("SELECT AVG(totgeral) FROM movvendas WHERE cancelada = 'N' AND emissao BETWEEN '" + data_inicio + "' AND '" + data_fim + "';");
        return rows;
    }

    async #connect() {
        return await mysql.createConnection(this.#connection_data);
    }
}

module.exports = DB;