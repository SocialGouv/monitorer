module.exports = {
  collectCoverage: true,
  // https://github.com/facebook/jest/issues/7331
  collectCoverageFrom: ["<rootDir>/src/job/**/*.js"],
  // https://github.com/facebook/create-react-app/issues/2007#issuecomment-296694661
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.js"]
};
