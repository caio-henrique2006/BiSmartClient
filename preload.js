const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld("db", {
    getLocalDBData: () => ipcRenderer.invoke('getLocalDBData', data_inicio, data_fim),
    sendDataToServer: (data_inicio, data_fim) => ipcRenderer.send('sendDataToServer', data_inicio, data_fim),
    setLogin: (email, password) => ipcRenderer.send('setLogin', email, password),
    setDBLogin: (user, password, database) => ipcRenderer.send('setDBLogin', user, password, database)
})

