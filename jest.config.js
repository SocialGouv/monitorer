module.exports = {
  bail: true,
  collectCoverage: true,
  collectCoverageFrom: ["**/*.js"],
  coveragePathIgnorePatterns: [
    "<rootDir>/jest.config.js",
    "<rootDir>/build",
    "<rootDir>/coverage",
    "<rootDir>/dist",
    "<rootDir>/node_modules",
    "<rootDir>/scripts",
    "<rootDir>/tests",
  ],
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.js"],
  testPathIgnorePatterns: ["<rootDir>/tests"],
};
