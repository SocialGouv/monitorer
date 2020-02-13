const axios = require("axios");
const log = require("@inspired-beings/log");
const R = require("ramda");

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
 * Check that the JSON source returned by a service URI meet the expectations for this service.
 *
 * @param {ServiceModel} service
 * @param {string[]} webhooks
 * @param {number} timeout
 *
 * @returns {Promise<void>}
 */
async function checkHtml({ expectations, name, uri }, webhooks, timeout) {
  if (expectations.length === 0) return;

  let isUp = true;
  let responseData;
  const date = Date.now();

  try {
    try {
      const { data } = await axios.get(uri, { timeout });
      responseData = data;
    } catch (err) {
      isUp = false;

      log.warn(`Service: ${uri}`);
      log.warn(`Error: "${err.message}"`);
    }
    const latency = Date.now() - date;

    if (isUp) {
      const data = R.type(responseData) === "Array" ? responseData[0] : responseData;
      if (data === undefined) throw new Error(`The data can't be processed.`);

      let result;
      for (const { method, selector, value } of expectations) {
        switch (method) {
          case "type":
            result = R.type(data[selector]);
            break;

          case "value":
            result = data[selector];
            break;

          default:
            throw new Error(`The "${method}" method is not available for json services.`);
        }

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
    log.err(`[worker] [checkers/checkJson()] [${uri}] Error: %s`, err.message || err);
  }
}

module.exports = checkHtml;
