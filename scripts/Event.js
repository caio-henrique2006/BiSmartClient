const fs = require("fs").promises;
const path = require("node:path");
const DB = require("./db.js");
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

  async checkLocalStorageFiles() {
    console.log("Checking local storage files...");
    if (!existsSync(this.db_file_path)) {
      const db_data = {
        user: "root",
        password: "",
        database: "geral",
      };
      await fs.writeFile(this.db_file_path, JSON.stringify(db_data));
    } else if (!existsSync(this.server_file_path)) {
      const server_data = {
        email: "*",
        password: "*",
        server_url: "https://bi-smart-server.vercel.app/",
      };
      await fs.writeFile(this.server_file_path, JSON.stringify(server_data));
    } else if (!existsSync(this.cache_file_path)) {
      const cache = {};
      await fs.writeFile(this.cache_file_path, JSON.stringify(cache));
    }
  }

  async sendDataToServer(data_inicio, data_fim) {
    console.log("Sending data to server...");
    const db = new DB();
    const server = new Server();
    const data_arr = await db.getData(data_inicio, data_fim);
    for (const data of data_arr) {
      const response = await server.sendDataToServer(data);
      console.log("Dados enviados: ", response);
    }
  }

  async setLogin(email, password) {
    console.log("Setting server login data...");
    const current_server_data = JSON.parse(
      await fs.readFile(this.server_file_path, "utf8")
    );
    const new_data = JSON.parse(JSON.stringify(current_server_data));
    new_data.email = email;
    new_data.password = password;
    await fs.writeFile(this.server_file_path, JSON.stringify(new_data));
    console.log("Salvo novos dados de login");
  }

  async setDBLogin(user, password, database) {
    console.log("Setting DB login data...");
    try {
      const current_db_data = JSON.parse(
        await fs.readFile(this.db_file_path, "utf8")
      );
      const new_data = JSON.parse(JSON.stringify(current_db_data));
      new_data.user = user;
      new_data.password = password;
      new_data.database = database;
      await fs.writeFile(this.db_file_path, JSON.stringify(new_data));
      console.log("Salvo novos dados de acesso ao banco de dados");
    } catch (e) {
      console.log("ERRO AO SALVAR DADOS DE LOGIN");
      console.log(e);
    }
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
        console.log("Sending changes to server...");
        await fs.writeFile(
          this.cache_file_path,
          JSON.stringify(current_data[1].dados)
        );
        console.log("Executa");
      } else {
        console.log("No changes found...");
        console.log("Nao Executa");
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
