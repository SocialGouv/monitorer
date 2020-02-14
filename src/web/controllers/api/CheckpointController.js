const log = require("@inspired-beings/log");

const cache = require("../../helpers/cache");
const Checkpoint = require("../../../shared/models/Checkpoint");

const DURATION = {
  ONE_DAY: { inMs: 1000 * 60 * 60 * 24 }, // => 240 checkpoints (with divider)
  ONE_HOUR: { inMs: 1000 * 60 * 60 }, // => 60 checkpoints (with divider)
  ONE_WEEK: { inMs: 1000 * 60 * 60 * 24 * 7 }, // => 240 checkpoints (with divider)
};

class ApiCheckpointController {
  /**
   * Get a list of checkpoints from the database.
   *
   * @param {import("koa").Context} ctx
   *
   * @returns {Promise<void>}
   */
  async index(ctx) {
    try {
      const { duration } = ctx.request.query;

      if (typeof duration !== "string" || duration.length === 0) {
        ctx.body = {
          errors: [{ message: "The `duration` query parameter is mandatory." }],
        };
        ctx.status = 400;

        return;
      }

      if (DURATION[duration] === undefined) {
        ctx.body = {
          errors: [
            {
              message: `The \`duration\` query parameter must be one of: ${Object.keys(
                DURATION,
              ).join(", ")}.`,
            },
          ],
        };
        ctx.status = 400;

        return;
      }

      // Cache
      const cacheKey = `chekpoints-${duration}`;
      const maybeCachedBody = cache.get(cacheKey);
      if (maybeCachedBody !== undefined) {
        ctx.body = maybeCachedBody;

        return;
      }

      const from = Date.now() - DURATION[duration].inMs;
      const rawCheckpoints = await Checkpoint.find({
        date: { $gt: from },
      }).sort({ date: -1 });
      const checkpoints = rawCheckpoints.map(({ date, isUp, latency, uri }) => ({
        date,
        isUp,
        latency,
        uri,
      }));

      cache.set(cacheKey, checkpoints, 1);
      ctx.body = checkpoints;
    } catch (err) {
      log.err(`[web] [controllers/api/ApiCheckpointController#index()] Error: ${err.message}`);

      ctx.status = 400;
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

      const { until, uri } = ctx.request.query;

      if (typeof until !== "string" || until.length === 0) {
        ctx.body = {
          errors: [{ message: "The `until` query parameter is mandatory." }],
        };
        ctx.status = 400;

        return;
      }

      if (typeof uri !== "string" || uri.length === 0) {
        ctx.body = {
          errors: [{ message: "The `uri` query parameter is mandatory." }],
        };
        ctx.status = 400;

        return;
      }

      await Checkpoint.deleteMany({ date: { $lte: until }, uri });

      ctx.status = 204;
    } catch (err) {
      log.err(`[web] [controllers/api/ApiCheckpointController#delete()] Error: ${err.message}`);

      ctx.status = 400;
    }
  }
}

module.exports = new ApiCheckpointController();
