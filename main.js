const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const DB = require("./db.js");


async function test_db() {
  const db = new DB();
  return await db.getAmountClients();
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

app.whenReady().then(() => {
  ipcMain.handle("test_db", test_db);
  createWindow()
})