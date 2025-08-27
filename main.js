const { app, BrowserWindow, ipcMain, Tray, Menu } = require("electron");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");
let tray = null;

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";
log.info("My custom 'update-downloaded' handler is running (ME)");
autoUpdater.on("update-downloaded", () => {
  log.info("Update downloaded. Installing now... (ME)");

  if (tray) {
    tray.destroy();
  }

  autoUpdater.quitAndInstall(true, true);
});

autoUpdater.on("update-available", () => {
  log.info("Update is available!");
});

autoUpdater.on("update-not-available", () => {
  log.info("No update available.");
});

autoUpdater.on("error", (err) => {
  log.error("Updater error:", err);
});

const fs = require("fs").promises;
const path = require("node:path");
const Event = require("./scripts/Event.js");
const DB = require("./scripts/db.js");

let win = null;
let exiting = false;

const handleEvent = new Event(app);

const createWindow = async () => {
  win = new BrowserWindow({
    width: 500,
    height: 700,
    show: false,
    autoHideMenuBar: true,
    title: "BISmart Clientes",
    icon: path.join(__dirname, "public/images/tray_icon.jpg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      devTools: true,
    },
  });

  await handleEvent.checkLocalStorageFiles();

  // handleEvent.cron();

  win.loadFile(path.join(__dirname, "pages/index.html"));

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
// handleEvent.cron();
// setInterval(() => {
//   handleEvent.cron();
// }, 1000 * 60 * 20);

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

ipcMain.handle("setLogin", async (event, args) => {
  const response = await handleEvent.setLogin(args.email, args.password);
  return response;
});

ipcMain.handle("sendDataToServer", async (event, args) => {
  const response = await handleEvent.sendDataToServer(
    args.data_inicio,
    args.data_fim
  );
  return response;
});
ipcMain.handle("setDBLogin", async (event, args) => {
  console.log("setting db login");
  const response = await handleEvent.setDBLogin(
    args.user,
    args.password,
    args.database
  );
  return response;
});

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
  autoUpdater.checkForUpdatesAndNotify();
  createWindow();
  tray = new Tray(path.join(__dirname, "public/images/tray_icon.jpg"));
  const contextMenu = Menu.buildFromTemplate([
    { label: "Mostrar", click: showWindow },
    { label: "Esconder", click: hideWindow },
    { label: "Fechar", click: closeWindow },
  ]);
  tray.setToolTip("BISmart Clientes");
  tray.setContextMenu(contextMenu);
});
