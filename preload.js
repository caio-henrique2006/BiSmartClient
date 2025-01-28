const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld("db", {
    invoke: (channel, args) => ipcRenderer.invoke(channel, args),
    sendDataToServer: (data_inicio, data_fim) => ipcRenderer.send('sendDataToServer', data_inicio, data_fim),
    setLogin: (email, password) => ipcRenderer.send('setLogin', email, password),
    setDBLogin: (user, password, database) => ipcRenderer.send('setDBLogin', user, password, database)
})

