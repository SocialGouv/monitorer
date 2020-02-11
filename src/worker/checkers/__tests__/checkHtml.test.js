const axios = require("axios");
const R = require("ramda");

jest.mock("axios");

global.CHECKPOINTS = [];
jest.mock("../../../shared/models/Checkpoint", () => {
  class Checkpoint {
    constructor(data) {
      this.data = data;
    }

    async findOne() {
      global.CHECKPOINTS.push(this.data);

      return Promise.resolve(this);
    }

    async save() {
      global.CHECKPOINTS.push(this.data);

      return Promise.resolve();
    }

    async sort() {
      global.CHECKPOINTS.push(this.data);

      return Promise.resolve(this);
    }
  }

  return Checkpoint;
});

const checkHtml = require("../checkHtml");

const TEST_SOURCE = `
  <html>
    <head>
      <title>A Page Title</title>
    </head>
    <body>
      <h1>A Header Text</h1>
    </body>
  </html>
`;

// eslint-disable-next-line jest/no-disabled-tests
describe.skip("[Worker] checkers/checkHtml()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test(`should pass with "html" method`, async () => {
    axios.get.mockResolvedValueOnce({
      data: TEST_SOURCE,
    });

    const service = {
      expectations: [
        {
          method: "html",
          selector: "title",
          value: "A Page Title",
        },
      ],
      uri: "https://example.com",
    };

    const beforeDate = Date.now();
    await checkHtml(service);
    const afterDate = Date.now();

    const lastCheckpoint = R.last(global.CHECKPOINTS);
    expect(lastCheckpoint.date).toBeGreaterThanOrEqual(beforeDate);
    expect(lastCheckpoint.date).toBeLessThanOrEqual(afterDate);
    expect(lastCheckpoint.isUp).toStrictEqual(true);
    expect(lastCheckpoint.latency).toBeGreaterThanOrEqual(0);
    expect(lastCheckpoint.uri).toStrictEqual(service.uri);
    expect(console.log).not.toHaveBeenCalled();
  });

  test(`should pass with "text" method`, async () => {
    axios.get.mockResolvedValueOnce({
      data: TEST_SOURCE,
    });

    const service = {
      expectations: [
        {
          method: "text",
          selector: "h1",
          value: "A Header Text",
        },
      ],
      uri: "https://example.com",
    };

    const beforeDate = Date.now();
    await checkHtml(service);
    const afterDate = Date.now();

    const lastCheckpoint = R.last(global.CHECKPOINTS);
    expect(lastCheckpoint.date).toBeGreaterThanOrEqual(beforeDate);
    expect(lastCheckpoint.date).toBeLessThanOrEqual(afterDate);
    expect(lastCheckpoint.isUp).toStrictEqual(true);
    expect(lastCheckpoint.latency).toBeGreaterThanOrEqual(0);
    expect(lastCheckpoint.uri).toStrictEqual(service.uri);
    expect(console.log).not.toHaveBeenCalled();
  });

  test(`should fail with a wrong expectation`, async () => {
    axios.get.mockResolvedValueOnce({
      data: TEST_SOURCE,
    });

    const service = {
      expectations: [
        {
          method: "text",
          selector: "h2",
          value: "A Non-Existing Header Text",
        },
      ],
      uri: "https://example.com",
    };

    const beforeDate = Date.now();
    await checkHtml(service);
    const afterDate = Date.now();

    const lastCheckpoint = R.last(global.CHECKPOINTS);
    expect(lastCheckpoint.date).toBeGreaterThanOrEqual(beforeDate);
    expect(lastCheckpoint.date).toBeLessThanOrEqual(afterDate);
    expect(lastCheckpoint.isUp).toStrictEqual(false);
    expect(lastCheckpoint.latency).toBeGreaterThanOrEqual(0);
    expect(lastCheckpoint.uri).toStrictEqual(service.uri);
    expect(console.log).toHaveBeenCalledTimes(3);
  });

  test(`should fail with an unknown method`, async () => {
    axios.get.mockResolvedValueOnce({
      data: TEST_SOURCE,
    });

    const service = {
      expectations: [
        {
          method: "unknown",
          selector: "h1",
          value: "A Header Text",
        },
      ],
      uri: "https://example.com",
    };

    const beforeDate = Date.now();
    await checkHtml(service);
    const afterDate = Date.now();

    const lastCheckpoint = R.last(global.CHECKPOINTS);
    expect(lastCheckpoint.date).toBeGreaterThanOrEqual(beforeDate);
    expect(lastCheckpoint.date).toBeLessThanOrEqual(afterDate);
    expect(lastCheckpoint.isUp).toStrictEqual(false);
    expect(lastCheckpoint.latency).toStrictEqual(0);
    expect(lastCheckpoint.uri).toStrictEqual(service.uri);
    expect(console.log).toHaveBeenCalledTimes(1);
  });

  test(`should fail with an unreachable service`, async () => {
    axios.get.mockRejectedValueOnce({
      data: "A website error.",
    });

    const service = {
      expectations: [
        {
          method: "text",
          selector: "h1",
          value: "A Header Text",
        },
      ],
      uri: "https://example.com",
    };

    const beforeDate = Date.now();
    await checkHtml(service);
    const afterDate = Date.now();

    const lastCheckpoint = R.last(global.CHECKPOINTS);
    expect(lastCheckpoint.date).toBeGreaterThanOrEqual(beforeDate);
    expect(lastCheckpoint.date).toBeLessThanOrEqual(afterDate);
    expect(lastCheckpoint.isUp).toStrictEqual(false);
    expect(lastCheckpoint.latency).toStrictEqual(0);
    expect(lastCheckpoint.uri).toStrictEqual(service.uri);
    expect(console.log).toHaveBeenCalledTimes(1);
  });
});
