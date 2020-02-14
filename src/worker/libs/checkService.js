const log = require("@inspired-beings/log");

const checkHtml = require("../checkers/checkHtml");
const checkJson = require("../checkers/checkJson");

/**
 * @typedef {object} ServiceModelExpectation
 * @property {string} method
 * @property {string} selector
 * @property {string} value
 */

/**
 * @typedef {object} ServiceModel
 * @property {string} uri
 * @property {string} displayName
 * @property {string} type
 * @property {ServiceModelExpectation[]} expectations
 */

/**
 * Check a service with the right type checker.
 *
 * @param {ServiceModel} service
 * @param {string[]} webhooks
 * @param {number} timeout
 *
 * @returns {Promise<void>}
 */
async function checkService(service, webhooks, timeout) {
  try {
    switch (service.type) {
      case "html":
        await checkHtml(service, webhooks, timeout);
        break;

      case "json":
        await checkJson(service, webhooks, timeout);
        break;

      default:
        throw 400;
    }
  } catch (err) {
    log.err(`[worker] [libs/checkService()] [${service.uri}] Error: %s`, err.message || err);
  }
}

module.exports = checkService;
