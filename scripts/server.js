const { app } = require("electron");
const fs = require("fs");
const path = require("node:path");

class Server {
  #email = "";
  #password = "";
  #server_url = "";
  #server_route = "client_send?client_origin=desktop";

  constructor() {
    this.init();
  }

  async init() {
    try {
      const path_userData = app.getPath("userData");
      const filePath = path.join(path_userData, "server_login.json");
      const data = JSON.parse(fs.readFileSync(filePath, { encoding: "utf8" }));
      console.log("server_login: ", data);
      this.#email = data.email;
      this.#password = data.password;
      this.#server_url = data.server_url;
    } catch (e) {
      throw e;
    }
  }

  async sendDataToServer(data) {
    try {
      console.log("URL: ", this.#server_url + this.#server_route);
      console.log("Email: ", this.#email);
      console.log("Password: ", this.#password);
      console.log("DATA: ", data);
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
      console.log(response_data);
      console.log(response.status);
      switch (response.status) {
        case 200:
          return "Enviado com sucesso";
        case 401:
          throw "Erro: Nao autorizado. Cheque os dados de login";
        default:
          throw "Erro: Problema interno";
      }
    } catch (e) {
      return e;
    }
  }
}

module.exports = Server;
