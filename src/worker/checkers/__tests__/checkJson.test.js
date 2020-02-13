const axios = require("axios");

jest.mock("axios");

global.CHECKPOINTS = [];
jest.mock("../../../shared/models/Checkpoint", () => {
  class Checkpoint {
    constructor(data) {
      if (data !== undefined) this.data = data;
    }

    static findOne() {
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

const checkJson = require("../checkJson");

const TIMEOUT = 15000;

describe("[Worker] checkers/checkJson()", () => {
  beforeEach(() => {
    global.CHECKPOINTS = [];

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
    await checkJson(service, [], TIMEOUT);
    const afterDate = Date.now();

    expect(global.CHECKPOINTS.length).toStrictEqual(1);
    const lastCheckpoint = global.CHECKPOINTS[0];
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
    await checkJson(service, [], TIMEOUT);
    const afterDate = Date.now();

    expect(global.CHECKPOINTS.length).toStrictEqual(1);
    const lastCheckpoint = global.CHECKPOINTS[0];
    expect(lastCheckpoint.date).toBeGreaterThanOrEqual(beforeDate);
    expect(lastCheckpoint.date).toBeLessThanOrEqual(afterDate);
    expect(lastCheckpoint.isUp).toStrictEqual(false);
    expect(lastCheckpoint.latency).toBeGreaterThanOrEqual(0);
    expect(lastCheckpoint.uri).toStrictEqual(service.uri);
    expect(console.log).toHaveBeenCalledTimes(3);
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

    await checkJson(service, [], TIMEOUT);

    expect(global.CHECKPOINTS.length).toStrictEqual(0);
    expect(console.log).toHaveBeenCalledTimes(1);
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
          method: "type",
          selector: "version",
          value: "String",
        },
      ],
      uri: "https://example.com",
    };

    const beforeDate = Date.now();
    await checkJson(service, [], TIMEOUT);
    const afterDate = Date.now();

    expect(global.CHECKPOINTS.length).toStrictEqual(1);
    const lastCheckpoint = global.CHECKPOINTS[0];
    expect(lastCheckpoint.date).toBeGreaterThanOrEqual(beforeDate);
    expect(lastCheckpoint.date).toBeLessThanOrEqual(afterDate);
    expect(lastCheckpoint.isUp).toStrictEqual(false);
    expect(lastCheckpoint.latency).toStrictEqual(0);
    expect(lastCheckpoint.uri).toStrictEqual(service.uri);
    expect(console.log).toHaveBeenCalledTimes(2);
  });
});
