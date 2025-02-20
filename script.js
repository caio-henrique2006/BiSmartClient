import Structure from "./scripts/structure.js";

const structure = new Structure();
document.getElementById("nav").innerHTML = structure.nav_element;
document.getElementById("title_card").innerHTML =
  structure.title_card_client_month("Cliente");
nav_func();

