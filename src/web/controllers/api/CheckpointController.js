const log = require("@inspired-beings/log");

const aggregateCheckpoints = require("../../helpers/aggregateCheckpoints");
const answerWithErrors = require("../../helpers/answerWithErrors");
const cache = require("../../helpers/cache");
const Checkpoint = require("../../../shared/models/Checkpoint");

const CACHE_TTL = 59; // => 1m
const DURATIONS = {
  ONE_DAY: { divider: 6, inMs: 24 * 60 * 60 * 1000 }, // => 240 checkpoints
  ONE_HOUR: { divider: 1, inMs: 60 * 60 * 1000 }, // => 60 checkpoints
  ONE_WEEK: { divider: 6 * 7, inMs: 7 * 24 * 60 * 60 * 1000 }, // => 240 checkpoints
};

class ApiCheckpointController {
  /**
   * Get last checkpoint date.
   *
   * @param {import("koa").Context} ctx
   *
   * @returns {Promise<void>}
   */
  async latest(ctx) {
    try {
      const { uri } = ctx.request.query;

      const CACHE_KEY = uri !== undefined ? `chekpoints-latest-${uri}` : `chekpoints-latest`;

      // Cache
      const maybeCachedBody = cache.get(CACHE_KEY);
      if (maybeCachedBody !== undefined) {
        ctx.body = maybeCachedBody;

        return;
      }

      // Get latest checkpoint:
      const checkpoint =
        uri !== undefined
          ? await Checkpoint.findOne({ uri }).sort({ date: -1 })
          : await Checkpoint.findOne().sort({ date: -1 });

      const body = checkpoint !== null ? checkpoint : { date: new Date(0).toISOString() };
      cache.set(CACHE_KEY, body, CACHE_TTL);
      ctx.body = body;
    } catch (err) {
      log.err(`[web] [controllers/api/ApiCheckpointController#getLatest()] Error: ${err.message}`);

      answerWithErrors(ctx, ["Please check the server logs for this error."]);
    }
  }

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

      const CACHE_KEY = `chekpoints-index-${uri}-${duration}`;

      // Cache
      const maybeCachedBody = cache.get(CACHE_KEY);
      if (maybeCachedBody !== undefined) {
        ctx.body = maybeCachedBody;

        return;
      }

      const since = new Date(Date.now() - DURATION.inMs);
      since.setSeconds(0, 0);

      const where = { date: { $gte: since }, uri };
      const sortBy = { date: -1 };
      const rawCheckpoints = await Checkpoint.find(where).sort(sortBy);
      const checkpoints = rawCheckpoints.map(({ date, latency }) => ({ date, latency }));
      const aggregatedCheckpoints = aggregateCheckpoints(
        checkpoints,
        DURATION.inMs,
        DURATION.divider,
      );

      const body = aggregatedCheckpoints;
      cache.set(CACHE_KEY, body, CACHE_TTL);
      ctx.body = body;
    } catch (err) {
      log.err(`[web] [controllers/api/ApiCheckpointController#index()] Error: ${err.message}`);

      answerWithErrors(ctx, ["Please check the server logs for this error."]);
    }
  }

  /**
   * Delete checkpoints from the database.
   *
   * @param {import("koa").Context} ctx
   *
   * @returns {Promise<void>}
   */
  async delete(ctx) {
    try {
      if (!ctx.isAdmin) {
        ctx.status = 401;

        return;
      }

      const { since, uri } = ctx.request.query;

      if (typeof since !== "string" || since.length === 0) {
        return answerWithErrors(ctx, ["`since` query parameter is mandatory."]);
      }

      if (typeof uri !== "string" || uri.length === 0) {
        return answerWithErrors(ctx, ["`uri` query parameter is mandatory."]);
      }

      await Checkpoint.deleteMany({ date: { $lte: since }, uri });

      ctx.status = 204;
    } catch (err) {
      log.err(`[web] [controllers/api/ApiCheckpointController#delete()] Error: ${err.message}`);

      answerWithErrors(ctx, ["Please check the server logs for this error."]);
    }
  }
}

module.exports = new ApiCheckpointController();
