const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("db", {
  invoke: (channel, args) => ipcRenderer.invoke(channel, args),
});
