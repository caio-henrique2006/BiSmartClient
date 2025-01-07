const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const DB = require("./db.js");


async function getLocalDBData(data_inicio, data_fim) {
  const db = new DB();
  const response = await db.getData(data_inicio, data_fim);
  return response;
}

async function sendDataToServer(data_inicio, data_fim) {
  const db = new DB();
  const response = await db.getData(data_inicio, data_fim);
  console.log(response);
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: true
    }
  })

  win.loadFile('index.html')
}

ipcMain.on('sendDataToServer', (event, data_inicio, data_fim) => {
  sendDataToServer(data_inicio, data_fim);
})

ipcMain.handle("getLocalDBData", async (event, data_inicio, data_fim) => {
  const response = await getLocalDBData(data_inicio, data_fim);
  return response;
})

app.whenReady().then(() => {
  createWindow()
});