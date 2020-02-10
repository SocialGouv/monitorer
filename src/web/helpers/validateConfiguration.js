const Ajv = require("ajv");
const log = require("@inspired-beings/log");
const R = require("ramda");
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

    const version = configuration.version;
    if (R.type(version) === "Undefined") {
      return [false, [{ message: `The configuration version is undefined.` }]];
    }
    if (R.type(version) !== "Number") {
      return [false, [{ message: `The configuration version is not a number.` }]];
    }

    const schema = SCHEMA[version];
    if (R.type(schema) === "Undefined") {
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
