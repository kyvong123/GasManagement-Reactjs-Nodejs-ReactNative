var json2xls = require('json2xls');
/**
 * Utils
 * @type {object}
 */
module.exports = {
  /**
   * Returns an object with error field for response
   * @param errorMessage {string}
   * @returns {{err_msg: {string}}}
   */
  jsonErr(errorMessage) {
    return {
      err_msg: errorMessage,
    };
  },

  /**
   * Chuyen Array thuong hieu thanh Object
   * cho de tim kiem
   */
  toPrefixObject(prefixArray) {
    return prefixArray.reduce((previousObj, currentPrefix, currentIndex) => {
      previousObj[currentPrefix] = [
        ...prefixArray.slice(currentIndex + 1),
        ...prefixArray.slice(0, currentIndex),
      ];
      return previousObj;
    }, {});
  },
};
