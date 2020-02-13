const cron = require("cron");
const dotenv = require("dotenv");
const log = require("@inspired-beings/log");
const path = require("path");
const yaml = require("yaml");

const checkService = require("./libs/checkService");
const Configuration = require("../shared/models/Configuration");
const connectMongo = require("../shared/libs/connectMongo");
const resetConfiguration = require("./helpers/resetConfiguration");

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.join(__dirname, "../../.env") });
}

const INTERVAL_CRON = "* * * * *";

/**
 * Run the checking job for all listed services.
 */
async function run() {
  try {
    const mongo = await connectMongo();

    const { source } = await Configuration.findOne();
    const configuration = yaml.parse(source);
    const { services, timeout, webhooks } = configuration;
    await Promise.all(services.map(service => checkService(service, webhooks, timeout)));

    await mongo.disconnect();
  } catch (err) {
    log.err(`[worker] [run()] Error: %s`, err.message || err);
  }
}

(async () => {
  try {
    const mongo = await connectMongo();

    // If the configuration isn't stored in database yet, we initialize it:
    const configuration = await Configuration.findOne();
    if (configuration === null) {
      await resetConfiguration();
    }

    await mongo.disconnect();

    // Start cron job:
    new cron.CronJob(INTERVAL_CRON, run, null, true);
  } catch (err) {
    log.err(`[worker] Error: %s`, err.message || err);
  }
})();
