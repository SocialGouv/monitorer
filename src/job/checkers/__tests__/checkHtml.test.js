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

import checkHtml from "../checkHtml";

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

describe("job/checkers/checkHtml()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test(`should pass with "html" method`, async () => {
    axios.get.mockResolvedValueOnce({
      data: TEST_SOURCE
    });

    const service = {
      address: "https://example.com",
      expectations: [
        {
          method: "html",
          selector: "title",
          value: "A Page Title"
        }
      ]
    };

    const beforeDate = Date.now();
    await checkHtml(service);
    const afterDate = Date.now();

    const lastCheckpoint = R.last(global.CHECKPOINTS);
    expect(lastCheckpoint.address).toStrictEqual(service.address);
    expect(lastCheckpoint.date).toBeGreaterThanOrEqual(beforeDate);
    expect(lastCheckpoint.date).toBeLessThanOrEqual(afterDate);
    expect(lastCheckpoint.isUp).toStrictEqual(true);
    expect(lastCheckpoint.latency).toBeGreaterThanOrEqual(0);
    expect(console.log).not.toHaveBeenCalled();
  });

  test(`should pass with "text" method`, async () => {
    axios.get.mockResolvedValueOnce({
      data: TEST_SOURCE
    });

    const service = {
      address: "https://example.com",
      expectations: [
        {
          method: "text",
          selector: "h1",
          value: "A Header Text"
        }
      ]
    };

    const beforeDate = Date.now();
    await checkHtml(service);
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
      data: TEST_SOURCE
    });

    const service = {
      address: "https://example.com",
      expectations: [
        {
          method: "text",
          selector: "h2",
          value: "A Non-Existing Header Text"
        }
      ]
    };

    const beforeDate = Date.now();
    await checkHtml(service);
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
      data: TEST_SOURCE
    });

    const service = {
      address: "https://example.com",
      expectations: [
        {
          method: "unknown",
          selector: "h1",
          value: "A Header Text"
        }
      ]
    };

    const beforeDate = Date.now();
    await checkHtml(service);
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
      data: "A website error."
    });

    const service = {
      address: "https://example.com",
      expectations: [
        {
          method: "text",
          selector: "h1",
          value: "A Header Text"
        }
      ]
    };

    const beforeDate = Date.now();
    await checkHtml(service);
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
