const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
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

app.whenReady().then(() => {
  createWindow()
});