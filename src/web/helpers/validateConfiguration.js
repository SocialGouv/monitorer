const Ajv = require("ajv");
const log = require("@inspired-beings/log");
const R = require("ramda");
const yaml = require("yaml");

const SCHEMA = {
  1: require("../../../shared/schemas/configuration.v1"),
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
    if (R.type(version) === "Undefined") throw new Error(`The version is undefined.`);
    if (R.type(version) !== "Number") throw new Error(`The version is not a number.`);

    const schema = SCHEMA[version];
    if (R.type(schema) === "Undefined") throw new Error(`This version is not supported.`);

    const ajv = new Ajv();
    const ajvValidate = ajv.compile(schema);

    return [ajvValidate(configuration), ajvValidate.errors];
  } catch (err) {
    log.err(`[web] [helpers/validateConfiguration()] Error: ${err.message}`);
  }
}

module.exports = validateConfiguration;
