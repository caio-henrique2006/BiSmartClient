document.getElementById("update_info").addEventListener("click", async () => {
  const response = await window.db.invoke("getInfo", "");
  document.getElementById("set_email").value = response.email;
  document.getElementById("set_password").value = "*******";
  document.getElementById("set_db_user").value = response.user;
  document.getElementById("set_db_password").value = response.password;
  document.getElementById("set_db_database").value = response.database;
});

window.onload = () => {
  document.getElementById("update_info").click();
};

document
  .getElementById("submit_showData")
  .addEventListener("click", async () => {
    const data_inicio = document.getElementById("showData_data_inicio").value;
    const data_fim = document.getElementById("showData_data_fim").value;
    console.log(data_inicio, data_fim);
    const response = await window.db.invoke("getData", {
      data_inicio: data_inicio,
      data_fim: data_fim,
    });
    console.log(response);
    document.getElementById("show_card").innerText = "";
    response.forEach((obj) => {
      obj.dados.forEach((item) => {
        Object.keys(item).forEach((key) => {
          document.getElementById("show_card").innerText +=
            key + ":" + item[key] + "\n";
        });
        document.getElementById("show_card").innerText += "\n";
      });
    });
  });

document
  .getElementById("submit_sendData")
  .addEventListener("click", async () => {
    const data_inicio = document.getElementById("sendData_data_inicio").value;
    const data_fim = document.getElementById("sendData_data_fim").value;
    console.log(data_inicio, data_fim);
    window.db.sendDataToServer(data_inicio, data_fim);
  });

document
  .getElementById("submit_set_login")
  .addEventListener("click", async () => {
    const email = document.getElementById("set_email").value;
    const password = document.getElementById("set_password").value;
    console.log(email, password);
    window.db.setLogin(email, password);
  });

document
  .getElementById("submit_set_localdb")
  .addEventListener("click", async () => {
    const user = document.getElementById("set_db_user").value;
    const password = document.getElementById("set_db_password").value;
    const database = document.getElementById("set_db_database").value;
    console.log(user, password, database);
    window.db.setDBLogin(user, password, database);
  });
