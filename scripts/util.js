const util = {
  isDataDifferent(data_1, data_2) {
    try {
      Object.keys(data_1).forEach((item) => {
        console.log("COMPARE: ", data_1[item], data_2[item]);
        if (data_1[item] !== data_2[item]) {
          throw "err";
        }
      });
      return false;
    } catch (e) {
      return true;
    }
  },
};

module.exports = util;
