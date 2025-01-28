const { app } = require('electron');
const mysql = require('mysql2/promise');
const handleDate = require('./handleDate.js');
const fs = require("fs");
const path = require('node:path');

class DB {
    #connection_data = {
        host: "",
        user: "",
        password: "",
        database: ""
    }
    #SQL_commands = {
        valor_vendas: "SELECT sum(totgeral) FROM movvendas WHERE cancelada = 'N' AND emissao BETWEEN ? AND ?;",
        valor_compras: "SELECT sum(totgeral) FROM MOVENT WHERE EMISSAO BETWEEN ? AND ? AND CANCELADA !='S';",
        quantidade_vendas: "SELECT count(docum) FROM movvendas WHERE cancelada = 'N' AND emissao BETWEEN ? AND ?;",
        ticket_medio: "SELECT AVG(totgeral) FROM movvendas WHERE cancelada = 'N' AND emissao BETWEEN ? AND ?;"
    }

    constructor () {
        this.init();
    }

    async init () {
        try {
            const path_userData = app.getPath("userData");
            const filePath = path.join(path_userData, 'db_login.json');
            const data = JSON.parse(fs.readFileSync(filePath, {encoding: 'utf8'}));
            this.#connection_data.host = "localhost";
            this.#connection_data.user = data.user;
            this.#connection_data.password = data.password;
            this.#connection_data.database = data.database;
        } catch (e) {
            throw e;
        }
    }

    async getData(data_inicio, data_fim) {
        console.log(this.#connection_data);
        if (handleDate.checkDate(data_inicio, data_fim)) {
            let data_arr = []
            const list_months = handleDate.getListOfMonths(data_inicio, data_fim);
            for (const month of list_months) {
                console.log(month);
                const data = await this.fetchDataOnLocalDb([month.data_inicio, month.data_fim]);
                data_arr.push(data);
            }
            return data_arr;
        } else {
            return [];
        }
    }

    async fetchDataOnLocalDb(parameters) {
        const valor_vendas = await this.executeSQLCommand("valor_vendas", this.#SQL_commands.valor_vendas, parameters);
        const valor_compras = await this.executeSQLCommand("valor_compras", this.#SQL_commands.valor_compras, parameters);
        const quantidade_vendas = await this.executeSQLCommand("quantidade_vendas", this.#SQL_commands.quantidade_vendas, parameters);
        const ticket_medio = await this.executeSQLCommand("ticket_medio", this.#SQL_commands.ticket_medio, parameters);
        const data = Object.assign({}, valor_vendas, valor_compras, quantidade_vendas, ticket_medio, 
            {
                data_inicio: parameters[0], 
                data_fim: parameters[1]
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
