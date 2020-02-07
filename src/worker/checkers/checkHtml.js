const axios = require("axios");
const cheerio = require("cheerio");
const log = require("@inspired-beings/log");

const Checkpoint = require("../../shared/models/Checkpoint");

/**
 * @typedef {object} ServiceModelExpectation
 * @property {string} method
 * @property {string} selector
 * @property {string} value
 */

/**
 * @typedef {object} ServiceModel
 * @property {string} uri
 * @property {string} name
 * @property {string} type
 * @property {ServiceModelExpectation[]} expectations
 */

/**
 * Check that the HTML source returned by a service URI meet the expectations for this service.
 *
 * @param {ServiceModel} service A service.
 *
 * @returns {Promise<void>}
 */
async function checkWebsite({ uri, expectations }) {
  if (expectations.length === 0) return;

  const date = Date.now();

  try {
    const { data: source } = await axios.get(uri);
    const latency = Date.now() - date;
    const $ = cheerio.load(source);

    let isUp = true;
    for (const { method, selector, value } of expectations) {
      if (typeof $(selector)[method] !== "function") {
        throw new Error(`The "${method}" method is not available for html services.`);
      }

      const result = $(selector)[method]();
      if (result !== value) isUp = false;
    }

    const checkpoint = new Checkpoint({
      date,
      isUp,
      latency,
      uri,
    });

    await checkpoint.save();
  } catch (err) {
    log.err(`[worker] [checkers/checkHtml()] [${uri}] Error: %s`, err.message || err);

    const checkpoint = new Checkpoint({
      date,
      isUp: false,
      latency: -1,
      uri,
    });

    await checkpoint.save();
  }
}

module.exports = checkWebsite;
