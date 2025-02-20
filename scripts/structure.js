import { path } from "../path.js";

export default class Structure {
  constructor(id) {
    this.block = `
            <div class="block_head">
                <div class="block_title">${id}</div>
                <div class="block_options">
                    <div class="block_options_date" id="block_options_date_conf_${id}" style="display: none;">
                        <input id="data_inicio_conf_${id}" type="date">
                        <input id="data_fim_conf_${id}" type="date">
                    </div>
                    <div class="block_options_date">
                        <input id="data_inicio_${id}" type="date">
                        <input id="data_fim_${id}" type="date">
                    </div>
                </div>
                <img src=${path.search_icon} width="28px" class="search_button" id="fetch_${id}">
            </div>
            <div class="block_head_other">
                <select id="display_${id}">
                    <option value="Table">Tabela</option>
                    <option value="LineChart">Linha</option>
                    <option value="BarChart">Barra</option>
                    <option value="PizzaChart">Pizza</option>
                </select>
                <div class="button_switch" id="button_switch_${id}">Comparar</div>
            </div>
            <div class="content">
                <div id="card" class="card">
                    <div id="content_${id}" style="display: flex; justify-content: center; align-items: center;"></div>
                </div>
            </div>
            `;
        this.period_block = `
            <div class="block_head">
                <div class="block_title">${id}</div>
                <div class="block_options">
                    <div class="block_options_date">
                        <input id="data_inicio_${id}" type="date">
                        <input id="data_fim_${id}" type="date">
                    </div>
                </div>
                <img src=${path.search_icon} width="28px" class="search_button" id="fetch_${id}">
            </div>
            <div class="block_head_other">
                <select id="display_${id}">
                    <option value="Table">Tabela</option>
                    <option value="LineChart">Linha</option>
                    <option value="BarChart">Barra</option>
                    <option value="PizzaChart">Pizza</option>
                </select>
            </div>
            <div class="content">
                <div id="card" class="card">
                    <div id="content_${id}" style="display: flex; justify-content: center; align-items: center;"></div>
                </div>
            </div>
            `;
    this.title_card_client_month = (title) => `
        <div class="title_card_content">
            <div>
                <p class="title">${title}</p>
            </div>
            <div class="search_date">
                <input type="date" id="data_inicio">
                <input type="date" id="data_fim">
                <img src=${path.search_icon} width="28px" class="search_button" id="btn_submit">
            </div>
        </div>
        <div>
            <a href=${path.config_path}>
                <img src=${path.config_icon} width="28px" />
            </a>
        </div>
    `;
  }
}

// {
//   /* <button id="btn_conflict_${id}">Criar Conflito</button>
// <select class="block_selectable_option" id="db_option_${id}">
//     <option value="atendimentos">Atendimentos</option>
//     <option value="setor_servico">Setor Serviço</option>
// </select>
// <select class="block_selectable_option" id="card_option_${id}">
//     <option value="BarChart">Barra</option>
//     <option value="Table">Tabela</option>
//     <option value="LineChart">Linha</option>
//     <option value="List">List</option>
// </select>

// <div style=visibility:hidden>
//     <input id="data_inicio_conf_${id}" type="date"> -
//     <input id="data_fim_conf_${id}" type="date">
// </div>
// */
// }
