const fs = require("fs");
const path = require('node:path');

class Server {
    #email = "";
    #password = "";
    #server_url = "";
    #server_place = "client_send";

    constructor () {
        this.init();
    }

    async init () {
        try {
            const filePath = path.join(__dirname, '../db/server_login.json');
            const data = JSON.parse(fs.readFileSync(filePath, {encoding: 'utf8'}));
            this.#email = data.email;
            this.#password = data.password;
            this.#server_url = data.server_url;
        } catch (e) {
            throw e;
        }
    }

    async sendDataToServer(data) {
        try {
            const response = await fetch(this.#server_url + this.#server_place, {
                method: "POST",
                mode: "cors",
                body: JSON.stringify(data),
                headers: {
                  "Content-type": "application/json",
                  email: this.#email,
                  password: this.#password
                },
            });
            // console.log(await response.text());
            const response_data = await response.json();
            switch (response_data.status) {
                case 200:
                    return "Sucesso";
                    break;
                case 401:
                    throw "Erro: Não autorizado";
                    break;
                default:
                    throw "Erro: sem informações do erro";
                    break;
            }
        } catch (e) {
            return e;
        }
    };  
}

module.exports = Server;