const fs = require("fs").promises;
const path = require("node:path");
const Server = require("./server.js");
const util = require("./util.js");
const { existsSync } = require("node:fs");
const { sub } = require("date-fns");

class Event {
  #app;
  db_file_path;
  server_file_path;
  cache_file_path;
  instance;

  constructor(app_instance) {
    if (this.instance) {
      throw new Error(
        "Nova Instância não pode ser criada. A presente classe é um singleton."
      );
    }
    this.instance = this;
    this.#app = app_instance;
    this.userData_path = this.#app.getPath("userData");
    this.db_file_path = path.join(this.userData_path, "db_login.json");
    this.server_file_path = path.join(this.userData_path, "server_login.json");
    this.cache_file_path = path.join(this.userData_path, "cache.json");
  }

  async sendDataToServer(data_arr) {
    const server = new Server();
    let response = "Erro no banco de dados. Cheque os dados de conexão";
    for (const data of data_arr) {
      response = await server.sendDataToServer(data);
      console.log("Dados enviados: ", response);
    }
    return response;
  }

  async cron() {
    try {
      const current_date = new Date();
      const previous_month_date = sub(current_date, {
        months: 1,
      });
      const data_inicio = previous_month_date.toISOString().slice(0, 8) + "01";
      const data_fim = current_date.toISOString().slice(0, 10);
      let { hasChanges, current_data } = await this.checkChangesOnLocalDB(
        data_inicio,
        data_fim
      );
      console.log("CURRENT DATA: ", current_data);
      if (hasChanges) {
        console.log("Changes detected...");
        console.log("Sending changes to server...");
        await fs.writeFile(
          this.cache_file_path,
          JSON.stringify(current_data[1].dados)
        );
        await this.sendDataToServer(
          current_data[0].data_inicio,
          current_data[1].data_fim,
          [current_data[0], current_data[1]]
        );
      } else {
        console.log("No changes found...");
      }
    } catch (e) {
      console.log("ERRO: Can't execute routine...");
      console.log(e);
    }
  }

  async checkChangesOnLocalDB(data_inicio, data_fim) {
    console.log("Checking Changes on Local DB...");
    const current_cache_data = JSON.parse(
      await fs.readFile(this.cache_file_path, "utf8")
    );
    const db = new DB();
    const current_data = await db.getData(data_inicio, data_fim);
    return {
      hasChanges: util.isDataDifferent(
        current_data[1].dados,
        current_cache_data
      ),
      current_data: current_data,
    };
  }
}

module.exports = Event;
