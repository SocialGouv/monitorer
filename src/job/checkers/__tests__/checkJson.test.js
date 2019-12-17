/**
 * @jest-environment node
 */

import axios from "axios";
import R from "ramda";

jest.mock("axios");

global.CHECKPOINTS = [];
jest.mock("../../../shared/models/makeCheckpoint", () => () => {
  const Checkpoint = function(data) {
    this.data = data;
  };

  Checkpoint.prototype.save = function() {
    global.CHECKPOINTS.push(this.data);
  };

  return Checkpoint;
});

import checkJson from "../checkJson";

describe("job/checkers/checkJson()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test(`should pass with "type" method`, async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        version: "1.2.3"
      }
    });

    const service = {
      address: "https://example.com",
      expectations: [
        {
          method: "type",
          selector: "version",
          value: "String"
        }
      ]
    };

    const beforeDate = Date.now();
    await checkJson(service);
    const afterDate = Date.now();

    const lastCheckpoint = R.last(global.CHECKPOINTS);
    expect(lastCheckpoint.address).toStrictEqual(service.address);
    expect(lastCheckpoint.date).toBeGreaterThanOrEqual(beforeDate);
    expect(lastCheckpoint.date).toBeLessThanOrEqual(afterDate);
    expect(lastCheckpoint.isUp).toStrictEqual(true);
    expect(lastCheckpoint.latency).toBeGreaterThanOrEqual(0);
    expect(console.log).not.toHaveBeenCalled();
  });

  test(`should fail with a wrong expectation`, async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        version: "1.2.3"
      }
    });

    const service = {
      address: "https://example.com",
      expectations: [
        {
          method: "type",
          selector: "version",
          value: "Array"
        }
      ]
    };

    const beforeDate = Date.now();
    await checkJson(service);
    const afterDate = Date.now();

    const lastCheckpoint = R.last(global.CHECKPOINTS);
    expect(lastCheckpoint.address).toStrictEqual(service.address);
    expect(lastCheckpoint.date).toBeGreaterThanOrEqual(beforeDate);
    expect(lastCheckpoint.date).toBeLessThanOrEqual(afterDate);
    expect(lastCheckpoint.isUp).toStrictEqual(false);
    expect(lastCheckpoint.latency).toBeGreaterThanOrEqual(0);
    expect(console.log).not.toHaveBeenCalled();
  });

  test(`should fail with an unknown method`, async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        version: "1.2.3"
      }
    });

    const service = {
      address: "https://example.com",
      expectations: [
        {
          method: "unknown",
          selector: "version",
          value: "String"
        }
      ]
    };

    const beforeDate = Date.now();
    await checkJson(service);
    const afterDate = Date.now();

    const lastCheckpoint = R.last(global.CHECKPOINTS);
    expect(lastCheckpoint.address).toStrictEqual(service.address);
    expect(lastCheckpoint.date).toBeGreaterThanOrEqual(beforeDate);
    expect(lastCheckpoint.date).toBeLessThanOrEqual(afterDate);
    expect(lastCheckpoint.isUp).toStrictEqual(false);
    expect(lastCheckpoint.latency).toStrictEqual(-1);
    expect(console.log).toHaveBeenCalled();
  });

  test(`should fail with an unreachable service`, async () => {
    axios.get.mockRejectedValueOnce({
      data: {
        error: "An API error."
      }
    });

    const service = {
      address: "https://example.com",
      expectations: [
        {
          method: "unknown",
          selector: "version",
          value: "String"
        }
      ]
    };

    const beforeDate = Date.now();
    await checkJson(service);
    const afterDate = Date.now();

    const lastCheckpoint = R.last(global.CHECKPOINTS);
    expect(lastCheckpoint.address).toStrictEqual(service.address);
    expect(lastCheckpoint.date).toBeGreaterThanOrEqual(beforeDate);
    expect(lastCheckpoint.date).toBeLessThanOrEqual(afterDate);
    expect(lastCheckpoint.isUp).toStrictEqual(false);
    expect(lastCheckpoint.latency).toStrictEqual(-1);
    expect(console.log).toHaveBeenCalled();
  });
});
