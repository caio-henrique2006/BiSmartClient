const { app } = require("electron");
const path = require("node:path");
const fs = require("fs");
const { existsSync } = require("node:fs");

const storage = {
    getStoragePaths() {
        const path_userData = app.getPath("userData");
        const storage_server_path = path.join(path_userData, "server_login.json");
        const storage_db_path = path.join(path_userData, "db_login.json");
        const storage_cache_path = path.join(path_userData, "cache.json");
        return { storage_server_path, storage_db_path, storage_cache_path }
    },

    async getServerInfo() {
        const { storage_server_path, storage_db_path } = this.getStoragePaths(app);
        const server_info = JSON.parse(await fs.promises.readFile(storage_server_path, "utf-8"));
        return server_info;
    },

    async getDBInfo() {
        const { storage_server_path, storage_db_path } = this.getStoragePaths(app);
        const db_info = JSON.parse(await fs.promises.readFile(storage_db_path, "utf-8"));
        return db_info;
    },

    async setDBInfo(user, password, database, system) {
        console.log("Setting DB login data...");
        const { storage_db_path } = this.getStoragePaths(app);
        try {
        const current_db_data = await this.getDBInfo(app);
        const new_data = JSON.parse(JSON.stringify(current_db_data));
        new_data.user = user;
        new_data.password = password;
        new_data.database = database;
        new_data.system = system;
        await fs.promises.writeFile(storage_db_path, JSON.stringify(new_data));
        console.log("Salvo novos dados de acesso ao banco de dados");
        } catch (e) {
        console.log("ERRO AO SALVAR DADOS DE LOGIN");
        console.log(e);
        }
        return "Dados Salvos";
    },

    async setServerInfo(email, password) {
        console.log("Setting server login data...");
        const { storage_server_path } = this.getStoragePaths(app);
        const current_server_data = await this.getServerInfo(app);
        const new_data = JSON.parse(JSON.stringify(current_server_data));
        new_data.email = email;
        new_data.password = password;
        await fs.promises.writeFile(storage_server_path, JSON.stringify(new_data));
        console.log("Salvo novos dados de login");
        return "Dados Salvos";
    },

    async setCacheData(cache_data) {
        console.log("Setting cache data...");
        const { storage_cache_path } = this.getStoragePaths(app);
        await fs.promises.writeFile(storage_cache_path, JSON.stringify(cache_data));
        console.log("Salvo novos dados de cache");
        return "Dados Salvos";
    },

    async checkLocalStorageFiles() {
        console.log("Checking local storage files...");
        const { storage_server_path, storage_db_path, storage_cache_path } = this.getStoragePaths(app);
        if (!existsSync(storage_db_path)) {
            const db_data = {
                user: "root",
                password: "",
                database: "geral",
                system: "Ello",
            };
            await fs.promises.writeFile(storage_db_path, JSON.stringify(db_data));
        }
        if (!existsSync(storage_server_path)) {
            const server_data = {
                email: "email@",
                password: "*",
                server_url: "https://bi-smart-server.vercel.app/",
            };
            await fs.promises.writeFile(storage_server_path, JSON.stringify(server_data));
        }
        if (!existsSync(storage_cache_path)) {
            const cache = {};
            await fs.promises.writeFile(storage_cache_path, JSON.stringify(cache));
        }
    }
}

module.exports = storage;
