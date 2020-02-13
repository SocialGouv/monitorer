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
 * @param {ServiceModel} service
 * @param {string[]} webhooks
 *
 * @returns {Promise<void>}
 */
async function checkWebsite({ expectations, name, uri }, webhooks) {
  if (expectations.length === 0) return;

  let isUp = true;
  let responseSource;
  const date = Date.now();

  try {
    try {
      const { data } = await axios.get(uri);
      responseSource = data;
    } catch (err) {
      isUp = false;

      log.warn(`Service: ${uri}`);
      log.warn(`Error: "${err.message}"`);
    }
    const latency = Date.now() - date;

    if (isUp) {
      const $ = cheerio.load(responseSource);
      for (const { method, selector, value } of expectations) {
        if (typeof $(selector)[method] !== "function") {
          throw new Error(`The "${method}" method is not available for html services.`);
        }

        const result = $(selector)
          [method]()
          .trim();
        if (result !== value) {
          isUp = false;

          log.warn(`Service: ${uri}`);
          log.warn(`Expected: "${value}"`);
          log.warn(`Received: "${result}"`);
        }
      }
    }

    const lastCheckpoint = await Checkpoint.findOne({ uri }).sort({ date: -1 });
    const newCheckpoint = new Checkpoint({
      date,
      isUp,
      latency: isUp ? latency : 0,
      uri,
    });
    await newCheckpoint.save();

    if (isUp !== lastCheckpoint.isUp) {
      webhooks.map(async webhook => {
        const message = !isUp && lastCheckpoint.isUp ? `${name} is down` : `${name} is up again`;
        await axios.post(webhook, {
          message,
          uri,
        });

        log.warn(`Webhook: ${webhook}`);
        log.warn(`Message: ${message}`);
      });
    }
  } catch (err) {
    log.err(`[worker] [checkers/checkHtml()] [${uri}] Error: %s`, err.message || err);
  }
}

module.exports = checkWebsite;
