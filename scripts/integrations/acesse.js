const { Pool } = require("pg");
const storage = require("../storage.js");

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
    this.pool = new Pool({
        host: "localhost",
        user: "postgres",
        password: "1234",
        database: "gallery",
        port: 5432,
        max: 10
    });
  }

  async getLocalData(data_inicio, data_fim) {
    const response = await this.executeQuery(this.SQL_Commands.getClientes, []);
    console.log(response);
    // try {
    //   if (handleDate.checkDate(data_inicio, data_fim)) {
    //     let data_arr = [];
    //     const list_months = handleDate.getListOfMonths(data_inicio, data_fim);
    //     // console.log("List months: ", list_months);
    //     for (const month of list_months) {
    //       let data_month_arr = [];
    //       let current_date = month.data_inicio;
    //       while (handleDate.inicioIsBeforeFim(current_date, month.data_fim)) {
    //         const data = await this.fetchDataOnLocalDb([
    //           current_date,
    //           current_date,
    //         ]);
    //         data_month_arr.push(data);
    //         let day = String(parseInt(current_date.slice(8, 10)) + 1);
    //         day = day.length == 1 ? "0" + day : day;
    //         current_date = current_date.slice(0, 7) + "-" + day;
    //       }
    //       data_arr.push({
    //         data_inicio: month.data_inicio,
    //         data_fim: month.data_fim,
    //         dados: data_month_arr,
    //       });
    //     }
    //     return data_arr;
    //   } else {
    //     return [];
    //   }
    // } catch (e) {
    //   console.log("Erro ao pegar dados no db: ", e);
    //   return [];
    // }
  }

  async fetchDataOnLocalDb(parameters) {
    
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

}

module.exports = Acesse;


// C:\PostgreSQL9\data\pg_log