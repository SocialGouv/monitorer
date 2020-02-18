const axios = require("axios");

jest.mock("axios");

global.CHECKPOINTS = [];
jest.mock("../../../shared/models/Checkpoint", () => {
  class Checkpoint {
    constructor(data) {
      if (data !== undefined) this.data = data;
    }

    static findOne({ date, uri }) {
      if (date !== undefined && uri !== undefined) return Promise.resolve(null);

      return new Checkpoint();
    }

    async save() {
      global.CHECKPOINTS.push(this.data);

      return Promise.resolve();
    }

    async sort() {
      return Promise.resolve(
        global.CHECKPOINTS.length === 0 ? null : global.CHECKPOINTS[global.CHECKPOINTS.length - 1],
      );
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
const TIMEOUT = 15000;

describe("[Worker] checkers/checkHtml()", () => {
  beforeEach(() => {
    global.CHECKPOINTS = [];

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

    const beforeDate = new Date();
    beforeDate.setSeconds(0, 0);
    await checkHtml(service, [], TIMEOUT);
    const afterDate = new Date();
    afterDate.setSeconds(0, 0);

    expect(global.CHECKPOINTS.length).toStrictEqual(1);
    const lastCheckpoint = global.CHECKPOINTS[0];
    expect(+lastCheckpoint.date).toBeGreaterThanOrEqual(+beforeDate);
    expect(+lastCheckpoint.date).toBeLessThanOrEqual(+afterDate);
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

    const beforeDate = new Date();
    beforeDate.setSeconds(0, 0);
    await checkHtml(service, [], TIMEOUT);
    const afterDate = new Date();
    afterDate.setSeconds(0, 0);

    expect(global.CHECKPOINTS.length).toStrictEqual(1);
    const lastCheckpoint = global.CHECKPOINTS[0];
    expect(+lastCheckpoint.date).toBeGreaterThanOrEqual(+beforeDate);
    expect(+lastCheckpoint.date).toBeLessThanOrEqual(+afterDate);
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

    const beforeDate = new Date();
    beforeDate.setSeconds(0, 0);
    await checkHtml(service, [], TIMEOUT);
    const afterDate = new Date();
    afterDate.setSeconds(0, 0);

    expect(global.CHECKPOINTS.length).toStrictEqual(1);
    const lastCheckpoint = global.CHECKPOINTS[0];
    expect(+lastCheckpoint.date).toBeGreaterThanOrEqual(+beforeDate);
    expect(+lastCheckpoint.date).toBeLessThanOrEqual(+afterDate);
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

    expect(global.CHECKPOINTS.length).toStrictEqual(0);
    await checkHtml(service, [], TIMEOUT);

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

    const beforeDate = new Date();
    beforeDate.setSeconds(0, 0);
    await checkHtml(service, [], TIMEOUT);
    const afterDate = new Date();
    afterDate.setSeconds(0, 0);

    expect(global.CHECKPOINTS.length).toStrictEqual(1);
    const lastCheckpoint = global.CHECKPOINTS[0];
    expect(+lastCheckpoint.date).toBeGreaterThanOrEqual(+beforeDate);
    expect(+lastCheckpoint.date).toBeLessThanOrEqual(+afterDate);
    expect(lastCheckpoint.isUp).toStrictEqual(false);
    expect(lastCheckpoint.latency).toStrictEqual(0);
    expect(lastCheckpoint.uri).toStrictEqual(service.uri);
    expect(console.log).toHaveBeenCalledTimes(2);
  });
});
