const fs = require("fs");
const log = require("@inspired-beings/log");
const path = require("path");

const Configuration = require("../../shared/models/Configuration");

/**
 * Reset the configuration stored in database with the default one.
 *
 * @returns {Promise<void>}
 */
async function resetConfiguration() {
  try {
    const sourcePath = path.join(__dirname, "../../shared/data/defaultConfiguration.v1.yml");
    const source = fs.readFileSync(sourcePath, { encoding: "utf8" });
    const configuration = new Configuration({ source });
    await configuration.save();
  } catch (err) {
    log.err(`[worker] [helpers/resetConfiguration()] Error: %s`, err.message || err);
  }
}

module.exports = resetConfiguration;
