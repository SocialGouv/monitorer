const log = require("@inspired-beings/log");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

const checkHtml = require("./checkers/checkHtml");
const checkJson = require("./checkers/checkJson");
const checkPing = require("./checkers/checkPing");
const Service = require("../shared/models/Service");

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve(__dirname, "../../.env") });
}

const { MONGODB_URI } = process.env;

async function checkService(service) {
  switch (service.type) {
    case "html":
      await checkHtml(service);
      break;

    case "json":
      await checkJson(service);
      break;

    case "ping":
      await checkPing(service);
      break;

    default:
      throw 400;
  }
}

async function run() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    const services = await Service.find();
    await Promise.all(services.map(checkService));

    await mongoose.disconnect();
  } catch (err) {
    log.error(`[job] [run()] Error: %s`, err.message || err);
  }
}

// https://stackoverflow.com/a/6398335/2736233
if (require.main === module) {
  run();
} else {
  module.exports = run;
}
