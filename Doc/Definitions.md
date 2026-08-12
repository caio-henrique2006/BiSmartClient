## DBInfo e DBServer

O `DBInfo` concentra os dados de conexão com o banco local do aplicativo, salvos em `db_login.json` dentro da pasta `userData` do Electron, com os campos `user`, `password`, `database` e `system`; ele é usado para selecionar o sistema de origem e abrir a conexão correta com os dados. Já o `DBServer` armazena as credenciais do serviço remoto em `server_login.json`, com `email`, `password` e `server_url`, e é consumido pelo fluxo de envio para autenticar as requisições e direcionar os dados ao servidor correspondente.
