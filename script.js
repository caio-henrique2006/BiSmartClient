document.getElementById("submit_sendData").addEventListener("click", async () => {
    const data_inicio = document.getElementById("sendData_data_inicio").value;
    const data_fim = document.getElementById("sendData_data_fim").value;
    window.db.sendDataToServer(data_inicio, data_fim);
});

document.getElementById("submit_showDataDB").addEventListener("click", async () => {
    const data_inicio = document.getElementById("showDataDB_data_inicio").value;
    const data_fim = document.getElementById("showDataDB_data_fim").value;
    // ipcRenderer.invoke('getLocalDBData', data_inicio, data_fim).then((result) => {
    //     console.log(result);
    // })
    // const response = await window.db.getLocalDBData(data_inicio, data_fim);
    // console.log(response);
})

document.getElementById("submit_showDataServer").addEventListener("click", async () => {
    const data_inicio = document.getElementById("showDataServer_data_inicio").value;
    const data_fim = document.getElementById("showDataServer_data_fim").value;
    // window.db.sendDataToServer(data_inicio, data_fim);
})