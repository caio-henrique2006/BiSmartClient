const { app } = require("electron");
const fs = require("fs");
const path = require("node:path");

class Server {
  #email = "";
  #password = "";
  #server_url = "";
  #server_route = "client_send";

  constructor() {
    this.init();
  }

  async init() {
    try {
      const path_userData = app.getPath("userData");
      const filePath = path.join(path_userData, "server_login.json");
      const data = JSON.parse(fs.readFileSync(filePath, { encoding: "utf8" }));
      this.#email = data.email;
      this.#password = data.password;
      this.#server_url = data.server_url;
    } catch (e) {
      throw e;
    }
  }

  async sendDataToServer(data) {
    try {
      // console.log("URL: ", this.#server_url + this.#server_route);
      const response = await fetch(this.#server_url + this.#server_route, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json",
          email: this.#email,
          password: this.#password,
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
  }
}

module.exports = Server;
