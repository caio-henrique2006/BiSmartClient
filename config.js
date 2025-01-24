document.getElementById("submit_sendData").addEventListener("click", async () => {
    const data_inicio = document.getElementById("sendData_data_inicio").value;
    const data_fim = document.getElementById("sendData_data_fim").value;
    console.log(data_inicio, data_fim);
    window.db.sendDataToServer(data_inicio, data_fim);
});

document.getElementById("submit_set_login").addEventListener("click", async () => {
    const email = document.getElementById("set_email").value;
    const password = document.getElementById("set_password").value;
    console.log(email, password);
    window.db.setLogin(email, password);
});

document.getElementById("submit_set_localdb").addEventListener("click", async () => {
    const user = document.getElementById("set_db_user").value;
    const password = document.getElementById("set_db_password").value;
    const database = document.getElementById("set_db_database").value;
    console.log(user, password, database);
    window.db.setDBLogin(user, password, database);
});