import Structure from "./scripts/structure.js";

const structure = new Structure();
document.getElementById("title_card").innerHTML =
  structure.title_card_client_month("Cliente");

document.getElementById("btn_submit").addEventListener("click", async () => {
  const data_inicio = document.getElementById("data_inicio").value;
  const data_fim = document.getElementById("data_fim").value;
  const response = await window.db.invoke('getData', {data_inicio: data_inicio, data_fim: data_fim});
  console.log(response);
})