const { app } = require("electron");
const mysql = require("mysql2/promise");
const handleDate = require("./handleDate.js");
const fs = require("fs");
const path = require("node:path");

class DB {
  #connection_data = {
    host: "",
    user: "",
    password: "",
    database: "",
    charset: "utf8mb4_unicode_ci",
  };
  #SQL_commands = {
    valor_vendas: `SELECT sum(totgeral) FROM movvendas WHERE cancelada = 'N' AND emissao BETWEEN ? AND ?;`,
    valor_compras: `SELECT sum(totgeral) FROM movent WHERE cancelada != 'S' AND chegada BETWEEN ? AND ?;`,
    quantidade_itens_vendidos: `SELECT sum(qtde) FROM movvendas mo USE INDEX (idx_movvendas_6),movvendasp mp, 
    produtos po,natoper na WHERE mo.row_id=mp.autoincr 
    AND mo.natoper=na.codigo 
    AND mp.produto=po.codigo 
    AND LOCATE(LEFT(RPAD(na.tipomov,1,' '),1),QUOTE('OVDG')) > 0 
    AND mo.filial = '01' AND mo.serie <> '' AND mo.emissao >= ? 
    AND mo.emissao <= ? AND LOCATE(LEFT(RPAD(mo.cancelada,1,' '),1),QUOTE('SC')) = 0`,
    quantidade_vendas: `SELECT count(docum) FROM movvendas WHERE cancelada = 'N' AND emissao BETWEEN ? AND ?;`,
    quantidade_compras: `SELECT sum(qtde) FROM movent movent1, moventp moventp1, fornecedor fornecedor1, 
    filial filial1, natoper natoper1,produtos produtos1 WHERE movent1.row_id=moventp1.autoincr 
    and movent1.fornec=fornecedor1.codigo and movent1.filial=filial1.filial 
    AND moventp1.produto=produtos1.codigo AND movent1.natoper = natoper1.codigo 
    AND LOCATE(LEFT(RPAD(movent1.cancelada,1,' '),1),QUOTE('SC')) = 0 
    AND movent1.filial = '01' AND movent1.efetivado = 'S' 
    AND LOCATE(LEFT(RPAD(natoper1.tipomov,1,' '),1),QUOTE('COF')) > 0 
    AND movent1.chegada >= ? AND movent1.chegada <= ?`,
    ticket_medio: `SELECT AVG(totgeral) FROM movvendas WHERE cancelada = 'N' AND emissao BETWEEN ? AND ?;`,
    vendas_grupo: `SELECT gp.descr as name, sum(qtde) as quantidade_itens, count(mo.docum) as quantidade_vendas, sum(mo.totgeral) as vendas
    FROM movvendas mo USE INDEX (idx_movvendas_6),movvendasp mp,
    produtos po,natoper na
    JOIN grupos gp ON po.grupo = gp.codigo
    WHERE mo.row_id=mp.autoincr
    AND mo.natoper=na.codigo
    AND mp.produto=po.codigo
    AND LOCATE(LEFT(RPAD(na.tipomov,1,' '),1),QUOTE('OVDG')) > 0
    AND mo.filial = '01'
    AND mo.serie <> ''
    AND mo.emissao >= ?
    AND mo.emissao <= ?
    AND LOCATE(LEFT(RPAD(mo.cancelada,1,' '),1),QUOTE('SC')) = 0
    GROUP BY gp.descr`,
  };

  constructor() {
    this.init();
  }

  async init() {
    try {
      const path_userData = app.getPath("userData");
      const filePath = path.join(path_userData, "db_login.json");
      const data = JSON.parse(fs.readFileSync(filePath, { encoding: "utf8" }));
      this.#connection_data.host = "localhost";
      this.#connection_data.user = data.user;
      this.#connection_data.password = data.password;
      this.#connection_data.database = data.database;
    } catch (e) {
      throw e;
    }
  }

  async getData(data_inicio, data_fim) {
    try {
      // console.log(this.#connection_data);
      // console.log(data_inicio, data_fim);
      if (handleDate.checkDate(data_inicio, data_fim)) {
        let data_arr = [];
        const list_months = handleDate.getListOfMonths(data_inicio, data_fim);
        // console.log("List months: ", list_months);
        for (const month of list_months) {
          let data_month_arr = [];
          let current_date = month.data_inicio;
          while (handleDate.inicioIsBeforeFim(current_date, month.data_fim)) {
            const data = await this.fetchDataOnLocalDb([
              current_date,
              current_date,
            ]);
            data_month_arr.push(data);
            let day = String(parseInt(current_date.slice(8, 10)) + 1);
            day = day.length == 1 ? "0" + day : day;
            current_date = current_date.slice(0, 7) + "-" + day;
          }
          data_arr.push({
            data_inicio: month.data_inicio,
            data_fim: month.data_fim,
            dados: data_month_arr,
          });
        }
        // console.log("DATA: ", data_arr[0].dados);
        return data_arr;
      } else {
        return [];
      }
    } catch (e) {
      console.log("Erro ao pegar dados no db: ", e);
      return [];
    }
  }

  async fetchDataOnLocalDb(parameters) {
    const valor_vendas = await this.executeSQLCommand(
      "valor_vendas",
      this.#SQL_commands.valor_vendas,
      parameters
    );
    const valor_compras = await this.executeSQLCommand(
      "valor_compras",
      this.#SQL_commands.valor_compras,
      parameters
    );
    const quantidade_itens_vendidos = await this.executeSQLCommand(
      "quantidade_itens_vendidos",
      this.#SQL_commands.quantidade_itens_vendidos,
      parameters
    );
    const quantidade_vendas = await this.executeSQLCommand(
      "quantidade_vendas",
      this.#SQL_commands.quantidade_vendas,
      parameters
    );
    const quantidade_compras = await this.executeSQLCommand(
      "quantidade_compras",
      this.#SQL_commands.quantidade_compras,
      parameters
    );
    const ticket_medio = await this.executeSQLCommand(
      "ticket_medio",
      this.#SQL_commands.ticket_medio,
      parameters
    );
    const vendas_grupo = await this.executeSQLCommand(
      "vendas_grupo",
      this.#SQL_commands.vendas_grupo,
      parameters,
      true
    );
    const data = Object.assign(
      {},
      valor_vendas,
      valor_compras,
      quantidade_itens_vendidos,
      quantidade_vendas,
      quantidade_compras,
      ticket_medio,
      vendas_grupo,
      {
        data: parameters[0],
      }
    );
    return data;
  }

  async executeSQLCommand(label, command, parameters, keep_structure = false) {
    const conn = await this.#connect();
    let [rows, fields] = await conn.query(command, parameters);
    console.log(label, rows);
    let value;
    if (keep_structure) {
      value = rows;
    } else {
      value = rows?.[0]?.[Object.keys(rows[0])[0]]
        ? rows?.[0]?.[Object.keys(rows[0])[0]]
        : 0;
    }
    const response = { [label]: value };
    conn.end();
    return response;
  }

  async #connect() {
    return await mysql.createConnection(this.#connection_data);
  }
}

module.exports = DB;
