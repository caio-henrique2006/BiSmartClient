const { app, BrowserWindow } = require('electron')
const path = require('node:path')
const DB = require("./db.js");


const db = new DB();
console.log(db);


const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})