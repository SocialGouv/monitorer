const Ajv = require("ajv");
const fs = require("fs");
const path = require("path");
const yaml = require("yaml");

const SCHEMA = require("../../schemas/configuration.v1");

describe("[Shared] data/defaultConfiguration.v1.yml", () => {
  test(`should be a valid JSON Schema`, async () => {
    const sourcePath = path.join(__dirname, "../defaultConfiguration.v1.yml");
    const source = fs.readFileSync(sourcePath, { encoding: "utf8" });
    const defaultConfiguration = yaml.parse(source);

    const ajv = new Ajv();
    const ajvValidate = ajv.compile(SCHEMA);

    expect(ajvValidate(defaultConfiguration)).toStrictEqual(true);
  });
});
