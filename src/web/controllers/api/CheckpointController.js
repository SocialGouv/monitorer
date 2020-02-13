const log = require("@inspired-beings/log");

const cache = require("../../helpers/cache");
const Checkpoint = require("../../../shared/models/Checkpoint");

const LENGTH = {
  "1D": { limit: 60 * 24 }, // => 240 checkpoints (with divider)
  "1H": { limit: 60 }, // => 60 checkpoints (with divider)
  "1W": { limit: 60 * 24 * 7 }, // => 240 checkpoints (with divider)
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
      const { length, uri } = ctx.request.query;

      if (typeof length !== "string" || length.length === 0) {
        ctx.body = {
          errors: [{ message: "The `length` query parameter is mandatory." }],
        };
        ctx.status = 400;

        return;
      }

      if (LENGTH[length] === undefined) {
        ctx.body = {
          errors: [{ message: "The `length` query parameter is mandatory." }],
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

      const { limit } = LENGTH[length];

      // Cache
      const cacheKey = `chekpoints-${uri}-${length}`;
      const maybeCachedBody = cache.get(cacheKey);
      if (maybeCachedBody !== undefined) {
        ctx.body = maybeCachedBody;

        return;
      }

      const rawCheckpoints = await Checkpoint.find({ uri })
        .sort({ date: -1 })
        .limit(limit);
      const checkpoints = rawCheckpoints.map(({ date, isUp, latency }) => ({
        date,
        isUp,
        latency,
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
