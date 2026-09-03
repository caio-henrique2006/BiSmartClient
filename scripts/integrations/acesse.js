const { Pool } = require("pg");
const storage = require("../storage.js");
const handleDate = require("../handleDate.js");

class Acesse {
    SQL_Commands = {
        getClientes: "SELECT * FROM cliente;",
        getVendasConsumidor: `SELECT SUM(svc.valor_total_itens::float) AS valor_vendas FROM saida_venda_consumidor svc 
        INNER JOIN (SELECT sc.numero_controle, SUM(vcp.valor_pagamento - vcp.valor_troco) 
        as total_unitario FROM saida_venda_consumidor sc INNER JOIN venda_consumidor_pagamento 
        vcp ON sc.numero_controle = vcp.numero_controle INNER JOIN lancamento la ON 
        vcp.codigo_lancamento = la.codigo WHERE sc.flag_processamento = -1 AND 
        sc.data_cancelamento IS NULL AND vcp.data_cancelamento IS NULL AND 
        sc.data_documento >= $1 AND sc.data_documento <= $2 
        GROUP BY sc.numero_controle) tmp ON svc.numero_controle = tmp.numero_controle 
        INNER JOIN documento doc ON svc.codigo_documento = doc.codigo 
        LEFT JOIN cliente cl ON svc.codigo_cliente = cl.codigo WHERE 
        svc.flag_processamento = -1 AND svc.data_documento >= $3 AND 
        svc.data_documento <= $4 
        GROUP BY svc.data_documento;`
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

  async fetchDataOnLocalDb(date_arr) {
    // const clientes = await this.executeQuery(this.SQL_Commands.getClientes, []);
    // console.log("Clientes: ", clientes);
    const valor_vendas = await this.executeQuery("valor_vendas", this.SQL_Commands.getVendasConsumidor,
      date_arr, { repeat_parameters: true });
    console.log("Valor Vendas: ", valor_vendas);
    const data = Object.assign(
      {},
      valor_vendas,
      {
        data: date_arr[0],
      }
    );
    return data;
  }

  async executeQuery(label, query, parameters, config = {}) {
    try {
      if (config.repeat_parameters) {
        parameters = [...parameters, ...parameters];
      }
      const response = await this.pool.query(query, parameters);
      const object = response.rows[0];
      if (object) return object;
      else return {[label]: 0.0000};
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