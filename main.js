const { app, BrowserWindow, ipcMain, Tray, Menu } = require("electron");
const { autoUpdater } = require("electron-updater");
const Server = require("./scripts/server.js");
const Ello = require("./scripts/integrations/ello.js");
const Acesse = require("./scripts/integrations/acesse.js");
const storage = require("./scripts/storage.js");
const log = require("electron-log");
let tray = null;

// Atualização remota
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

// Definição base
const fs = require("fs").promises;
const path = require("node:path");
const Event = require("./scripts/Event.js");

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

  await storage.checkLocalStorageFiles(app);

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

// Serviços
ipcMain.handle("getInfo", async (event, args) => {
  const server_info = await storage.getServerInfo();
  const db_info = await storage.getDBInfo();
  const response = { ...server_info, ...db_info };
  return response;
});

ipcMain.handle("sendDataToServer", async (event, args) => {
  const db_info = await storage.getDBInfo();
  const system = db_info.system;
  switch (system) {
    case "Ello":
      const ello = new Ello();
      const ello_data_arr = await ello.getLocalData(
        args.data_inicio,
        args.data_fim,
      );
      const ello_response = await handleEvent.sendDataToServer(ello_data_arr);
      return ello_response;
      break;
    case "Acesse":
      const acesse = new Acesse();
      await acesse.init();
      const acesse_data_arr = await acesse.getLocalData(
        args.data_inicio,
        args.data_fim,
      );
      const acesse_response = await handleEvent.sendDataToServer(acesse_data_arr);
      return acesse_response;
      break;
    default:
      return "Sistema não suportado. Cheque as configurações do banco de dados.";
      break;
  }
});

ipcMain.handle("setLogin", async (event, args) => {
  const response = await storage.setServerInfo(args.email, args.password);
  return response;
});

ipcMain.handle("setDBLogin", async (event, args) => {
  const response = await storage.setDBInfo(
    args.user,
    args.password,
    args.database,
    args.system,
  );
  return response;
});

// Funções da janela
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

// Rotina de inicialização
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
