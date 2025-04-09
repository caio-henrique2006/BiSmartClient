const { app, BrowserWindow, ipcMain, Tray, Menu } = require("electron");
const fs = require("fs").promises;
const path = require("node:path");
const Event = require("./scripts/Event.js");
const DB = require("./scripts/db.js");
const Server = require("./scripts/server.js");

let win = null;
let exiting = false;
const handleEvent = new Event(app);
setInterval(() => {
  handleEvent.cron();
}, 1000 * 60 * 5);

const createWindow = async () => {
  win = new BrowserWindow({
    width: 500,
    height: 700,
    show: false,
    autoHideMenuBar: true,
    title: "BISmart Clientes",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      devTools: true,
    },
  });

  await handleEvent.checkLocalStorageFiles();

  handleEvent.cron();

  win.loadFile("index.html");

  win.on("close", (event) => {
    if (!exiting) {
      event.preventDefault();
      win.hide();
    }
  });

  win.on("closed", () => {
    win = null;
  });
};

ipcMain.handle("getData", async (event, args) => {
  console.log("Argumentos: ", args);
  const db = new DB();
  const data_arr = await db.getData(args.data_inicio, args.data_fim);
  return data_arr;
});

ipcMain.handle("getInfo", async (event, args) => {
  const path_userData = app.getPath("userData");
  const storage_server_path = path.join(path_userData, "server_login.json");
  const storage_db_path = path.join(path_userData, "db_login.json");
  const server_data = JSON.parse(
    await fs.readFile(storage_server_path, "utf-8")
  );
  const db_data = JSON.parse(await fs.readFile(storage_db_path, "utf-8"));
  const response_data = { ...server_data, ...db_data };
  return response_data;
});

ipcMain.on("sendDataToServer", async (event, data_inicio, data_fim) => {
  await handleEvent.sendDataToServer(data_inicio, data_fim);
});
ipcMain.on("setLogin", async (event, email, password) => {
  await handleEvent.setLogin(email, password);
});
ipcMain.on("setDBLogin", async (event, user, password, database) => {
  console.log("setting db login");
  await handleEvent.setDBLogin(user, password, database);
});

let tray = null;

function showWindow() {
  if (!win) createWindow();
  win.show();
  win.focus();
}

function hideWindow() {
  if (win) {
    win.hide();
  }
}

function closeWindow() {
  exiting = true;
  app.quit();
}

app.whenReady().then(() => {
  createWindow();
  tray = new Tray("./assets/tray_icon.jpg");
  const contextMenu = Menu.buildFromTemplate([
    { label: "Mostrar", click: showWindow },
    { label: "Esconder", click: hideWindow },
    { label: "Fechar", click: closeWindow },
  ]);
  tray.setToolTip("BISmart Clientes");
  tray.setContextMenu(contextMenu);
});
