document.getElementById("submit_sendData").addEventListener("click", async () => {
    const data_inicio = document.getElementById("sendData_data_inicio").value;
    const data_fim = document.getElementById("sendData_data_fim").value;
    console.log(data_inicio, data_fim);
    window.db.sendDataToServer(data_inicio, data_fim);
});

