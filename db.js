const mysql = require("mysql");

class DB {
    #connection_data = {
        host: "localhost",
        user: "root",
        password: "",
        database: "geral"
    }
    #data = {};

    async getAmountClients() {
        await this.#get("SELECT count(codigo) FROM cliente");
        return this.#data;
    }

    async #get(sql) {
        let con = mysql.createConnection(this.#connection_data);
        con.connect(async function(err) {
            if (err) throw err;
        });
        con.query(sql, async (err, result, fields) => {
            this.#setData(err, result, fields);
        });
        con.end()
    }

    async #setData(err, result, fields) {
        if (err) throw err;
        this.#data = result;
    }
}

module.exports = DB;