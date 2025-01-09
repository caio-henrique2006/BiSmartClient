const mysql = require('mysql2/promise');

class DB {
    #connection_data = {
        host: "localhost",
        user: "root",
        password: "",
        database: "geral"
    }
    #SQL_commands = {
        valor_vendas: "SELECT sum(totgeral) FROM movvendas WHERE cancelada = 'N' AND emissao BETWEEN '" + data_inicio + "' AND '" + data_fim + "';",
        valor_compras: "SELECT sum(totgeral) FROM MOVENT WHERE EMISSAO BETWEEN '" + data_inicio + "' AND '" + data_fim + "' AND CANCELADA !='S';",
        quantidade_vendas: "SELECT count(docum) FROM movvendas WHERE cancelada = 'N' AND emissao BETWEEN '" + data_inicio + "' AND '" + data_fim + "';",
        ticket_medio: "SELECT AVG(totgeral) FROM movvendas WHERE cancelada = 'N' AND emissao BETWEEN '" + data_inicio + "' AND '" + data_fim + "';"
    }

    async getData(data_inicio, data_fim) {
        const valor_vendas = await this.getValorVendas(data_inicio, data_fim);
        const valor_compras = await this.getValorCompras(data_inicio, data_fim);
        const quantidade_vendas = await this.getQuantidadeVendas(data_inicio, data_fim);
        const ticket_medio = await this.getTicketMedio(data_inicio, data_fim);
        const data = Object.assign({}, valor_vendas, valor_compras, quantidade_vendas, ticket_medio);
        return data;
    }

    async executeSQLCommand(label, command) {
        const conn = await this.#connect();
        let [rows, fields] = await conn.query(command);
        conn.end();
    } 

    async getValorVendas(data_inicio, data_fim) {
        const conn = await this.#connect();
        let [rows, fields] = await conn.query("SELECT sum(totgeral) FROM movvendas WHERE cancelada = 'N' AND emissao BETWEEN '" + data_inicio + "' AND '" + data_fim + "';");
        const value = rows[0]["sum(totgeral)"] ? rows[0]["sum(totgeral)"] : 0;
        const response = {"valor_vendas": value};
        return response;
    }

    async getValorCompras(data_inicio, data_fim) {
        const conn = await this.#connect();
        let [rows, fields] = await conn.query("SELECT sum(totgeral) FROM MOVENT WHERE EMISSAO BETWEEN '" + data_inicio + "' AND '" + data_fim + "' AND CANCELADA !='S';");
        const value = rows[0]["sum(totgeral)"] ? rows[0]["sum(totgeral)"] : 0;
        const response = {"valor_compras": value};
        return response;
    }

    async getQuantidadeVendas(data_inicio, data_fim) {
        const conn = await this.#connect();
        let [rows, fields] = await conn.query("SELECT count(docum) FROM movvendas WHERE cancelada = 'N' AND emissao BETWEEN '" + data_inicio + "' AND '" + data_fim + "';");
        const value = rows[0]["count(docum)"] ? rows[0]["count(docum)"] : 0;
        const response = {"quantidade_vendas": value};
        return response;
    }

    async getTicketMedio(data_inicio, data_fim) {
        const conn = await this.#connect();
        let [rows, fields] = await conn.query("SELECT AVG(totgeral) FROM movvendas WHERE cancelada = 'N' AND emissao BETWEEN '" + data_inicio + "' AND '" + data_fim + "';");
        const value = rows[0]["AVG(totgeral)"] ? rows[0]["AVG(totgeral)"] : 0;
        const response = {"ticket_medio": value};
        return response;
    }

    async #connect() {
        return await mysql.createConnection(this.#connection_data);
    }
}

module.exports = DB;


    // async getQuantidadeItensVendidos(data_inicio, data_fim) {
    //     const conn = await this.#connect();
    //     let [rows, fields] = await conn.query("SELECT COUNT(PRODUTO) FROM MOVVENDASP WHERE natoper != 5202 AND natoper != 5411 AND EMISSAO BETWEEN '" + data_inicio + "' AND '" + data_fim + "' AND DOCUM IN (SELECT DOCUM FROM MOVVENDAS WHERE CANCELADA = '' AND EMISSAO BETWEEN '" + data_inicio + "' AND '" + data_fim + "');");
    //     return rows;
    // }

    // async getQuantidadeItensComprados(data_inicio, data_fim) {
    //     const conn = await this.#connect();
    //     let [rows, fields] = await conn.query("SELECT COUNT(PRODUTO) FROM MOVENTP WHERE emissao BETWEEN '" + data_inicio + "' AND '" + data_fim + "' AND DOCUM IN (SELECT DOCUM FROM MOVVENDAS WHERE CANCELADA !='S' AND EMISSAO BETWEEN '" + data_inicio + "' AND '" + data_fim + "');");
    //     return rows;
    // }
        // async getAmountClients() {
    //     const conn = await this.#connect();
    //     let [rows, fields] = await conn.query("SELECT count(codigo) FROM cliente");
    //     return rows;
    // }
