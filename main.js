const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs").promises;
const { existsSync } = require("node:fs");
const path = require("node:path");
const DB = require("./scripts/db.js");
const Server = require("./scripts/server.js");

async function sendDataToServer(data_inicio, data_fim) {
  const db = new DB();
  const server = new Server();
  const data_arr = await db.getData(data_inicio, data_fim);
  console.log("array of data: ", data_arr);
  for (const data of data_arr) {
    const response = await server.sendDataToServer(data);
    console.log(response);
  }
}

async function setLogin(email, password) {
  const path_userData = app.getPath("userData");
  const filePath = path.join(path_userData, "server_login.json");
  const current_server_data = JSON.parse(await fs.readFile(filePath, "utf8"));
  const new_data = JSON.parse(JSON.stringify(current_server_data));
  new_data.email = email;
  new_data.password = password;
  await fs.writeFile(filePath, JSON.stringify(new_data));
  console.log("Salvo novos dados de login");
}

async function setDBLogin(user, password, database) {
  const path_userData = app.getPath("userData");
  const filePath = path.join(path_userData, "db_login.json");
  const current_server_data = JSON.parse(await fs.readFile(filePath, "utf8"));
  const new_data = JSON.parse(JSON.stringify(current_server_data));
  new_data.user = user;
  new_data.password = password;
  new_data.database = database;
  await fs.writeFile(filePath, JSON.stringify(new_data));
  console.log("Salvo novos dados de acesso ao banco de dados");
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 500,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      devTools: true,
    },
  });

  win.loadFile("index.html");
};

ipcMain.handle("getData", async (event, args) => {
  const db = new DB();
  const data_arr = await db.getData(args.data_inicio, args.data_fim);
  return data_arr;
});

ipcMain.handle("getInfo", async (event, args) => {
  const path_userData = app.getPath("userData");
  const storage_server_path = path.join(path_userData, "server_login.json");
  const storage_db_path = path.join(path_userData, "db_login.json");
  console.log(path_userData);
  console.log(storage_server_path);
  console.log(storage_db_path);
  if (
    !existsSync(path_userData) ||
    !existsSync(storage_db_path) ||
    !existsSync(storage_server_path)
  ) {
    const server_data = {
      email: "*",
      password: "*",
      server_url: "https://bi-smart-server.vercel.app/",
    };
    const db_data = {
      user: "root",
      password: "",
      database: "geral",
    };
    await fs.writeFile(storage_server_path, JSON.stringify(server_data));
    await fs.writeFile(storage_db_path, JSON.stringify(db_data));
  }

  const server_data = JSON.parse(
    await fs.readFile(storage_server_path, "utf-8")
  );
  const db_data = JSON.parse(await fs.readFile(storage_db_path, "utf-8"));
  const response_data = { ...server_data, ...db_data };
  return response_data;
});

ipcMain.on("sendDataToServer", (event, data_inicio, data_fim) => {
  sendDataToServer(data_inicio, data_fim);
});
ipcMain.on("setLogin", (event, email, password) => {
  setLogin(email, password);
});
ipcMain.on("setDBLogin", async (event, user, password, database) => {
  console.log("setting db login");
  await setDBLogin(user, password, database);
});

app.whenReady().then(() => {
  createWindow();
});
