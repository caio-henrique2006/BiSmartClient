const mysql = require('mysql2/promise');
const util = require("util");

class DB {
    #connection_data = {
        host: "localhost",
        user: "root",
        password: "",
        database: "geral"
    }
    #data = {};

    async getAmountClients() {
        const conn = await mysql.createConnection(this.#connection_data);
        let [rows, fields] = await conn.execute("SELECT count(codigo) FROM cliente");
        return rows;
    }

    #get(sql) {
        let con = mysql.createConnection(this.#connection_data);
        con.connect(function(err) {
            if (err) throw err;
        });
        con.query(sql, (err, result, fields) => {
            this.#setData(err, result, fields);
        });
        con.end()
    }

    #setData(err, result, fields) {
        if (err) throw err;
        console.log(result);
        this.#data = result;
    }
}

module.exports = DB;