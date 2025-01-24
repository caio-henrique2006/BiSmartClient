const { app, BrowserWindow, ipcMain } = require('electron')
const fs = require("fs");
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

async function setLogin(email, password) {
  const filePath = path.join(__dirname, 'db/server_login.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;
    console.log(email, password);
    console.log("before: ", data);
    let new_data = {
      "email": email,
      "password": password
    };
    new_data = JSON.stringify(new_data);
    console.log(new_data);
    fs.writeFile(filePath, new_data, () => {
      if (err) throw err;
      console.log('Salvo novos dados de login');
    });
  });
}

async function setDBLogin(user, password, database) {
  const filePath = path.join(__dirname, 'db/db_login.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;
    console.log("antes: ", data);
    let new_data = {
      "user": user,
      "password": password,
      "database": database
    };
    new_data = JSON.stringify(new_data);
    console.log(new_data);
    fs.writeFile(filePath, new_data, () => {
      if (err) throw err;
      console.log('Salvo novos dados de acesso ao db local');
    });
  });
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
ipcMain.on('setLogin', (event, email, password) => {
  setLogin(email, password);
})
ipcMain.on('setDBLogin', (event, user, password, database) => {
  setDBLogin(user, password, database);
})


app.whenReady().then(() => {
  createWindow()
});