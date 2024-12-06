const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld("db", {
    test: () => ipcRenderer.invoke('test_db')
})