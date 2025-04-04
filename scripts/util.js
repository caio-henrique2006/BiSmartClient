const util = {
  isDataEqual(data_1, data_2) {
    try {
      Object.keys(data_1).forEach((item) => {
        if (data_1[item] != data_2[item]) {
          return false;
        }
      });
      return true;
    } catch (e) {
      return false;
    }
  },
};

module.exports = util;
