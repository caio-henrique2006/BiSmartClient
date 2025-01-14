const mysql = require('mysql2/promise');
const handleDate = require('./handleDate.js');

class DB {
    #connection_data = {
        host: "localhost",
        user: "root",
        password: "",
        database: "geral"
    }
    #SQL_commands = {
        valor_vendas: "SELECT sum(totgeral) FROM movvendas WHERE cancelada = 'N' AND emissao BETWEEN ? AND ?;",
        valor_compras: "SELECT sum(totgeral) FROM MOVENT WHERE EMISSAO BETWEEN ? AND ? AND CANCELADA !='S';",
        quantidade_vendas: "SELECT count(docum) FROM movvendas WHERE cancelada = 'N' AND emissao BETWEEN ? AND ?;",
        ticket_medio: "SELECT AVG(totgeral) FROM movvendas WHERE cancelada = 'N' AND emissao BETWEEN ? AND ?;"
    }

    async getData(data_inicio, data_fim) {
        if (handleDate.checkDate(data_inicio, data_fim)) {
            
        }
    }

    async fetchDataOnLocalDb(parameters) {
        const valor_vendas = await this.executeSQLCommand("valor_vendas", this.#SQL_commands.valor_vendas, parameters);
        const valor_compras = await this.executeSQLCommand("valor_compras", this.#SQL_commands.valor_compras, parameters);
        const quantidade_vendas = await this.executeSQLCommand("quantidade_vendas", this.#SQL_commands.quantidade_vendas, parameters);
        const ticket_medio = await this.executeSQLCommand("ticket_medio", this.#SQL_commands.ticket_medio, parameters);
        const data = Object.assign({}, valor_vendas, valor_compras, quantidade_vendas, ticket_medio, 
            {
                data_inicio: data_inicio, 
                data_fim: data_fim
            });
        return data;
    }

    async executeSQLCommand(label, command, parameters) {
        const conn = await this.#connect();
        let [rows, fields] = await conn.query(command, parameters);
        const value = rows[0][Object.keys(rows[0])[0]] ? rows[0][Object.keys(rows[0])[0]] : 0;
        const response = {[label]: value};
        conn.end();
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
