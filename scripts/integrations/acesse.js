const { Pool } = require("pg");
const storage = require("../storage.js");
const handleDate = require("../handleDate.js");

class Acesse {
    SQL_Commands = {
        getClientes: "SELECT * FROM cliente;"
    };
  db_info;
  server_info;
  pool;

  async init() {
    this.db_info = await storage.getDBInfo();
    this.server_info = await storage.getServerInfo();
    this.pool = this.createPool(this.db_info);
  }

  async getLocalData(data_inicio, data_fim) {
    const response = await this.executeQuery(this.SQL_Commands.getClientes, []);
    console.log(response);
    try {
      if (handleDate.checkDate(data_inicio, data_fim)) {
        let data_arr = [];
        const list_months = handleDate.getListOfMonths(data_inicio, data_fim);
        for (const month of list_months) {
          let data_month_arr = [];
          let current_date = month.data_inicio;
          while (handleDate.inicioIsBeforeFim(current_date, month.data_fim)) {
            try {
              const data = await this.fetchDataOnLocalDb([
                current_date,
                current_date
              ]);
              data_month_arr.push(data);
              // While Incremental
              let day = String(parseInt(current_date.slice(8, 10)) + 1);
              day = day.length == 1 ? "0" + day : day;
              current_date = current_date.slice(0, 7) + "-" + day;
            } catch (e) {
              console.log(e);
              continue;
            }
          }
          data_arr.push({
            data_inicio: month.data_inicio,
            data_fim: month.data_fim,
            dados: data_month_arr,
          });
          return data_arr;
        } 
      } else {
        return [];
      }
    } catch (e) {
      console.log("Erro ao pegar dados no db: ", e);
      return [];
    }
  }

  async fetchDataOnLocalDb() {
    const clientes = await this.executeQuery(this.SQL_Commands.getClientes, []);
    console.log("Clientes: ", clientes);
  }

  async executeQuery(query, parameters) {
    try {
      const result = await this.pool.query(query, parameters);
      return result.rows;
    } catch (e) {
      console.log("Erro ao executar query: ", e);
      return [];
    }
  }

  createPool(db_info) {
    const pool = new Pool({
      host: "localhost",
      user: db_info.user,
      password: db_info.password,
      database: db_info.database,
      port: 5434,
      max: 10
    });
    if (pool) return pool;
    else throw new Error("Erro ao criar pool de conexão com o banco de dados");
  }
}

module.exports = Acesse;


// C:\PostgreSQL9\data\pg_log