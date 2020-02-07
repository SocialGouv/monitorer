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

const { MONITORER_CRON } = process.env;

/**
 * Run the checking job for all listed services.
 */
async function run() {
  try {
    const mongo = await connectMongo();

    let configuration = await Configuration.findOne();

    // If the configuration doesn't exist yet, we initialize it:
    if (configuration === null) {
      await resetConfiguration();
      configuration = await Configuration.findOne();
    }

    const configurationData = yaml.parse(configuration.source);
    await Promise.all(configurationData.services.map(checkService));

    await mongo.disconnect();
  } catch (err) {
    log.err(`[worker] [run()] Error: %s`, err.message || err);
  }
}

new cron.CronJob(MONITORER_CRON, run, null, true);
