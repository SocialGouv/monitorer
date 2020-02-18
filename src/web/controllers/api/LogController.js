const log = require("@inspired-beings/log");

const answerWithErrors = require("../../helpers/answerWithErrors");
const cache = require("../../helpers/cache");
const Checkpoint = require("../../../shared/models/Checkpoint");

/**
 * @typedef {object} LogItem
 * @property {Date} from
 * @property {Date=} to
 */

const CACHE_TTL = 59; // => 1m
const DURATIONS = {
  ONE_DAY: { divider: 6, inMs: 24 * 60 * 60 * 1000 }, // => 240 checkpoints
  ONE_HOUR: { divider: 1, inMs: 60 * 60 * 1000 }, // => 60 checkpoints
  ONE_WEEK: { divider: 6 * 7, inMs: 7 * 24 * 60 * 60 * 1000 }, // => 240 checkpoints
};

class ApiLogController {
  /**
   * Get a list of checkpoints from the database.
   *
   * @param {import("koa").Context} ctx
   *
   * @returns {Promise<void>}
   */
  async index(ctx) {
    try {
      const { duration, uri } = ctx.request.query;

      if (typeof duration !== "string" || duration.length === 0) {
        return answerWithErrors(ctx, ["`duration` query parameter is mandatory."]);
      }

      if (typeof uri !== "string" || uri.length === 0) {
        return answerWithErrors(ctx, ["`uri` query parameter is mandatory."]);
      }

      const DURATION = DURATIONS[duration];

      if (DURATION === undefined) {
        return answerWithErrors(ctx, [
          `\`duration\` query parameter must be one of: ${Object.keys(DURATION).join(", ")}.`,
        ]);
      }

      const CACHE_KEY = `logs-${uri}-${duration}`;

      // Cache
      const maybeCachedBody = cache.get(CACHE_KEY);
      if (maybeCachedBody !== undefined) {
        ctx.body = maybeCachedBody;

        return;
      }

      const since = new Date(Date.now() - DURATION.inMs);
      since.setSeconds(0, 0);

      const where = { date: { $gte: since }, uri };
      const sortBy = { date: 1 };
      const checkpoints = await Checkpoint.find(where).sort(sortBy);
      const logs = checkpoints.reduce((prev, { date, latency }) => {
        if (prev.length === 0) {
          if (latency === 0) prev.push({ from: date });

          return prev;
        }

        const firstOfPrev = prev[0];
        if (latency === 0 && firstOfPrev.to !== undefined) prev.unshift({ from: date });
        if (latency > 0 && firstOfPrev.to === undefined) firstOfPrev.to = date;

        return prev;
      }, []);
      const body = logs;
      cache.set(CACHE_KEY, body, CACHE_TTL);
      ctx.body = body;
    } catch (err) {
      log.err(`[web] [controllers/api/ApiLogController#index()] Error: ${err.message}`);

      answerWithErrors(ctx, ["Please check the server logs for this error."]);
    }
  }
}

module.exports = new ApiLogController();
