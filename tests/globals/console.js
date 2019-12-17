global.console = {
  // eslint-disable-next-line no-console
  debug: console.log,
  error: jest.fn(),
  info: jest.fn(),
  log: jest.fn(),
  warn: jest.fn()
};
