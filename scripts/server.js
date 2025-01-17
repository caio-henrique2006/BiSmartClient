class Server {
    #email = "user_test_2@gmail.com";
    #password = "123456";
    #server_url = "http://localhost:3001/";
    #server_place = "client_send";

    async sendDataToServer(data) {
        try {
            const response = await fetch(this.#server_url + this.#server_place, {
                method: "POST",
                mode: "cors",
                body: JSON.stringify(data),
                headers: {
                  "Content-type": "application/json",
                  email: this.#email,
                  password: this.#password
                },
            });
            // console.log(await response.text());
            const response_data = await response.json();
            switch (response_data.status) {
                case 200:
                    return "Sucesso";
                    break;
                case 401:
                    throw "Erro: Não autorizado";
                    break;
                default:
                    throw "Erro: sem informações do erro";
                    break;
            }
        } catch (e) {
            return e;
        }
    };  
}

module.exports = Server;