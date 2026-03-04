/**
 * Standard API response formatter
 * @param {boolean} success
 * @param {string} message
 * @param {object} data
 * @param {number} statusCode
 */
const sendResponse = (res, success, message = '', data = null, statusCode = 200) => {
  const payload = {
    success,
    message,
    ...(data !== null && { data }),
  };
  return res.status(statusCode).json(payload);
};

module.exports = { sendResponse };
