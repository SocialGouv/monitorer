const R = require("ramda");

/**
 * @typedef {object} Checkpoint
 * @property {Date} date
 * @property {number} latency
 */

/**
 * Generate a list of aggregated latencies from a list of checkpoints.
 *
 * @param {Checkpoint[]} checkpoints
 * @param {number} duration
 * @param {number} divider
 *
 * @returns {Checkpoint[]}
 */
function aggregateCheckpoints(checkpoints, duration, divider) {
  if (divider === 1) {
    return checkpoints;
  }

  return R.pipe(
    R.splitEvery(divider),
    R.map(checkpointsCluster => {
      const aggregatedCheckpoint = R.reduce(
        (prev, checkpoint) => ({
          ...prev,
          latency:
            prev.latency !== 0 && checkpoint.latency !== 0 ? prev.latency + checkpoint.latency : 0,
        }),
        checkpointsCluster[0],
      )(checkpointsCluster.slice(1));

      return {
        ...aggregatedCheckpoint,
        latency: Math.round(aggregatedCheckpoint.latency / divider),
      };
    }),
  )(checkpoints);
}

module.exports = aggregateCheckpoints;
