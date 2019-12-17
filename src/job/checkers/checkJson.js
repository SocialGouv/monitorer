const log = require("@inspired-beings/log");
const axios = require("axios");
const R = require("ramda");

const Checkpoint = require("../../shared/models/Checkpoint");

async function checkWebsite({ address, expectations }) {
  const date = Date.now();

  try {
    const { data } = await axios.get(address);
    const latency = Date.now() - date;

    let isUp = true;
    for (const { method, selector, value } of expectations) {
      switch (method) {
        case "type":
          if (R.type(data[selector]) !== value) isUp = false;
          break;

        default:
          throw new Error(`The "${method}" method is not available for json services.`);
      }
    }

    const checkpoint = new Checkpoint({
      address,
      date,
      isUp,
      latency
    });

    await checkpoint.save();
  } catch (err) {
    log.err(`[job/checkers/checkJson()] [${address}] Error: %s`, err.message || err);

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
