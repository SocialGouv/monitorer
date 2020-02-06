const axios = require("axios");
const R = require("ramda");

jest.mock("axios");

global.CHECKPOINTS = [];
jest.mock("../../../shared/models/Checkpoint", () => {
  class Checkpoint {
    constructor(data) {
      this.data = data;
    }

    async save() {
      global.CHECKPOINTS.push(this.data);

      return Promise.resolve();
    }
  }

  return Checkpoint;
});

const checkJson = require("../checkJson");

describe("[Worker] checkers/checkJson()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test(`should pass with "type" method`, async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        version: "1.2.3",
      },
    });

    const service = {
      expectations: [
        {
          method: "type",
          selector: "version",
          value: "String",
        },
      ],
      uri: "https://example.com",
    };

    const beforeDate = Date.now();
    await checkJson(service);
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
      data: {
        version: "1.2.3",
      },
    });

    const service = {
      expectations: [
        {
          method: "type",
          selector: "version",
          value: "Array",
        },
      ],
      uri: "https://example.com",
    };

    const beforeDate = Date.now();
    await checkJson(service);
    const afterDate = Date.now();

    const lastCheckpoint = R.last(global.CHECKPOINTS);
    expect(lastCheckpoint.date).toBeGreaterThanOrEqual(beforeDate);
    expect(lastCheckpoint.date).toBeLessThanOrEqual(afterDate);
    expect(lastCheckpoint.isUp).toStrictEqual(false);
    expect(lastCheckpoint.latency).toBeGreaterThanOrEqual(0);
    expect(lastCheckpoint.uri).toStrictEqual(service.uri);
    expect(console.log).not.toHaveBeenCalled();
  });

  test(`should fail with an unknown method`, async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        version: "1.2.3",
      },
    });

    const service = {
      expectations: [
        {
          method: "unknown",
          selector: "version",
          value: "String",
        },
      ],
      uri: "https://example.com",
    };

    const beforeDate = Date.now();
    await checkJson(service);
    const afterDate = Date.now();

    const lastCheckpoint = R.last(global.CHECKPOINTS);
    expect(lastCheckpoint.date).toBeGreaterThanOrEqual(beforeDate);
    expect(lastCheckpoint.date).toBeLessThanOrEqual(afterDate);
    expect(lastCheckpoint.isUp).toStrictEqual(false);
    expect(lastCheckpoint.latency).toStrictEqual(-1);
    expect(lastCheckpoint.uri).toStrictEqual(service.uri);
    expect(console.log).toHaveBeenCalled();
  });

  test(`should fail with an unreachable service`, async () => {
    axios.get.mockRejectedValueOnce({
      data: {
        error: "An API error.",
      },
    });

    const service = {
      expectations: [
        {
          method: "unknown",
          selector: "version",
          value: "String",
        },
      ],
      uri: "https://example.com",
    };

    const beforeDate = Date.now();
    await checkJson(service);
    const afterDate = Date.now();

    const lastCheckpoint = R.last(global.CHECKPOINTS);
    expect(lastCheckpoint.date).toBeGreaterThanOrEqual(beforeDate);
    expect(lastCheckpoint.date).toBeLessThanOrEqual(afterDate);
    expect(lastCheckpoint.isUp).toStrictEqual(false);
    expect(lastCheckpoint.latency).toStrictEqual(-1);
    expect(lastCheckpoint.uri).toStrictEqual(service.uri);
    expect(console.log).toHaveBeenCalled();
  });
});
