const log = require("@inspired-beings/log");
const axios = require("axios");
const cheerio = require("cheerio");

const Checkpoint = require("../../shared/models/Checkpoint");

async function checkWebsite({ address, expectations }) {
  const date = Date.now();

  try {
    const { data: source } = await axios.get(address);
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
      address,
      date,
      isUp,
      latency
    });

    await checkpoint.save();
  } catch (err) {
    log.err(`[job/checkers/checkHtml()] [${address}] Error: %s`, err.message || err);

    const checkpoint = new Checkpoint({
      address,
      date,
      isUp: false,
      latency: -1
    });

    await checkpoint.save();
  }
}

module.exports = checkWebsite;
