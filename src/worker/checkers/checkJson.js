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
 *
 * @returns {Promise<void>}
 */
async function checkHtml({ uri, expectations }) {
  if (expectations.length === 0) return;

  const date = Date.now();

  try {
    const res = await axios.get(uri);
    const latency = Date.now() - date;

    const data = R.type(res.data) === "Array" ? res.data[0] : res.data;
    if (data === undefined) throw new Error(`The data can't be processed.`);

    let isUp = true;
    for (const { method, selector, value } of expectations) {
      switch (method) {
        case "type":
          if (R.type(data[selector]) !== value) isUp = false;
          break;

        case "value":
          if (data[selector] !== value) isUp = false;
          break;

        default:
          throw new Error(`The "${method}" method is not available for json services.`);
      }
    }

    const checkpoint = new Checkpoint({
      date,
      isUp,
      latency,
      uri,
    });

    await checkpoint.save();
  } catch (err) {
    log.err(`[worker] [checkers/checkJson()] [${uri}] Error: %s`, err.message || err);

    const checkpoint = new Checkpoint({
      date,
      isUp: false,
      latency: -1,
      uri,
    });

    await checkpoint.save();
  }
}

module.exports = checkHtml;
