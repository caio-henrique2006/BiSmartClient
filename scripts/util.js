const util = {
  isDataDifferent(data_1, data_2) {
    try {
      Object.keys(data_1).forEach((key) => {
        if (
          typeof data_1[key] === "object" &&
          typeof data_2[key] === "object"
        ) {
          const response = this.isDataDifferent(data_1[key], data_2[key]);
          if (response) {
            throw "Erro: Diferentes";
          }
        } else if (
          (typeof data_1[key] === "number" &&
            typeof data_2[key] === "number") ||
          (typeof data_1[key] === "string" && typeof data_2[key] === "string")
        ) {
          if (data_1[key] !== data_2[key]) {
            throw "Erro: Diferentes";
          }
        } else {
          throw "Erro: Diferentes";
        }
      });
      return false;
    } catch (e) {
      return true;
    }
  },
};

module.exports = util;
