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
 * @param {number} timeout
 *
 * @returns {Promise<void>}
 */
async function checkWebsite({ expectations, name, uri }, webhooks, timeout) {
  if (expectations.length === 0) return;

  let isUp = true;
  let response;
  const now = Date.now();

  try {
    try {
      response = await axios.get(uri, { timeout });
    } catch (err) {
      isUp = false;

      log.warn(`Service: ${uri}`);
      log.warn(`Error: "${err.message}"`);
    }

    // Calculate latency:
    const latency = Date.now() - now;

    // Round date seconds and milliseconds down:
    const date = new Date(now);
    date.setSeconds(0, 0);

    // Skip this checkpoint if it already exists:
    if ((await Checkpoint.findOne({ date, uri })) !== null) {
      return;
    }

    if (isUp) {
      const $ = cheerio.load(response.data);
      for (const { method, selector, value } of expectations) {
        if (typeof $(selector).first()[method] !== "function") {
          throw new Error(`The "${method}" method is not available for html services.`);
        }

        const result = $(selector)
          .first()
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

    if (lastCheckpoint !== null && isUp !== lastCheckpoint.isUp) {
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
