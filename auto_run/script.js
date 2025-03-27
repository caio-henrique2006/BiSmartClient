const DB = require("../scripts/db.js");
const Server = require("../scripts/server.js");
/*
Fazer o código funcionar uma vez a cada 1 hora.
Puxar os dados de 3 meses pra trás
*/
const db = new DB();
const server = new Server();
const data_arr = await db.getData(data_inicio, data_fim);
console.log("array of data: ", data_arr);
for (const data of data_arr) {
    const response = await server.sendDataToServer(data);
    console.log(response);
}