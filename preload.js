const { contextBridge } = require('electron')
const DB = require("./db.js")

const db = new DB();

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  data: db.test()
  // we can also expose variables, not just functions
})
