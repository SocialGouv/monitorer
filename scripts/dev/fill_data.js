const fs = require("fs");
const log = require("@inspired-beings/log");
const ora = require("ora");
const path = require("path");
const yaml = require("yaml");

const Checkpoint = require("../../src/shared/models/Checkpoint");
const Configuration = require("../../src/shared/models/Configuration");
const connectMongo = require("../../src/shared/libs/connectMongo");
const resetConfiguration = require("../../src/worker/helpers/resetConfiguration");

const spinner = ora();

/**
 * Generate a checkpoint with ramdom data.
 *
 * @param {*} service
 * @param {Date} date
 *
 * @returns {Promise<void>}
 */
async function generateCheckpoint({ uri }, date) {
  const lastCheckpoint = await Checkpoint.findOne({ uri }).sort({ date: -1 });
  const r = Math.random();
  let latency = Math.floor(Math.random() * 14999) + 1;
  if (lastCheckpoint !== null && lastCheckpoint.latency === 0) {
    latency = r >= 0.2 ? 0 : latency;
  } else {
    latency = r >= 0.95 ? 0 : latency;
  }
  const isUp = latency !== 0;

  const checkpoint = new Checkpoint({ date, isUp, latency, uri });
  await checkpoint.save();
}

(async () => {
  try {
    const mongo = await connectMongo();

    spinner.start(`Checking configuration…`);

    // Check existing configuration:
    let hasToReset = false;
    const maybeConfiguration = await Configuration.findOne();
    if (maybeConfiguration !== null) {
      const originalSourcePath = path.join(
        __dirname,
        "../../src/shared/data/defaultConfiguration.v1.yml",
      );
      const originalSource = fs.readFileSync(originalSourcePath, { encoding: "utf8" });

      const { source } = maybeConfiguration;

      // Reset configuration if the sources don't match:
      hasToReset = source !== originalSource;
    } else {
      hasToReset = true;
    }

    spinner.succeed(`Configuration checked.`);

    if (hasToReset) {
      spinner.start(`Resetting configuration…`);

      await resetConfiguration();

      spinner.succeed(`Configuration reset.`);

      // Drop Checkpoint collection if it exists:
      if ((await Checkpoint.findOne()) !== null) {
        spinner.start(`Dropping Chekpoint collection…`);

        await Checkpoint.collection.drop();

        spinner.succeed(`Chekpoint collection dropped.`);
      }
    }

    spinner.start(`Loading configuration…`);

    const { source } = await Configuration.findOne();
    const configuration = yaml.parse(source);
    const { services } = configuration;

    spinner.succeed(`Configuration loaded`);

    spinner.start(`Generating data…`);

    // One week ago:
    const startDate = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const firstService = services[0];
    for (let currentDate = startDate; currentDate <= Date.now(); currentDate += 60 * 1000) {
      const date = new Date(currentDate);
      date.setSeconds(0, 0);

      // Skip if data already exists:
      if ((await Checkpoint.findOne({ date, uri: firstService.uri })) !== null) continue;

      spinner.text = `Generating data: ${date.toISOString()}…`;

      await Promise.all(services.map(service => generateCheckpoint(service, date)));
    }

    spinner.succeed(`Data generated.`);

    await mongo.disconnect();
  } catch (err) {
    spinner.fail();

    log.err(`[scripts/dev/fill_data.js] Error: %s`, err.message || err);
  }

  spinner.stop();
})();
