const Ajv = require("ajv");
const log = require("@inspired-beings/log");
const yaml = require("yaml");

const SCHEMA = {
  1: require("../../shared/schemas/configuration.v1"),
};

/**
 * Validate a YAML configuration.
 *
 * @param {string} source - YAML source
 *
 * @returns {[boolean, import("ajv").ErrorObject[]]}
 */
function validateConfiguration(source) {
  try {
    const configuration = yaml.parse(source);

    const { version } = configuration;
    if (version === undefined) {
      return [false, [{ message: `The configuration version is undefined.` }]];
    }
    if (typeof version !== "number") {
      return [false, [{ message: `The configuration version is not a number.` }]];
    }

    const schema = SCHEMA[version];
    if (schema === undefined) {
      return [false, [{ message: `This configuration version is not supported.` }]];
    }

    const ajv = new Ajv();
    const ajvValidate = ajv.compile(schema);

    return [ajvValidate(configuration), ajvValidate.errors];
  } catch (err) {
    log.err(`[web] [helpers/validateConfiguration()] Error: ${err.message}`);

    return [false, [{ message: `Something went wrong during validation process.` }]];
  }
}

module.exports = validateConfiguration;
