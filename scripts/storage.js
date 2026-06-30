const path = require("node:path");
const fs = require("fs");

const storage = {
    getStoragePaths(app) {
        const path_userData = app.getPath("userData");
        const storage_server_path = path.join(path_userData, "server_login.json");
        const storage_db_path = path.join(path_userData, "db_login.json");
        return { storage_server_path, storage_db_path }
    },

    async getServerInfo(app) {
        const { storage_server_path, storage_db_path } = this.getStoragePaths(app);
        const server_info = JSON.parse(await fs.promises.readFile(storage_server_path, "utf-8"));
        return server_info;
    },

    async getDBInfo(app) {
        const { storage_server_path, storage_db_path } = this.getStoragePaths(app);
        const db_info = JSON.parse(await fs.promises.readFile(storage_db_path, "utf-8"));
        return db_info;
    }
}

module.exports = storage;
