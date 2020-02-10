const log = require("@inspired-beings/log");

const Checkpoint = require("../../../shared/models/Checkpoint");

const NUMBER_OF_MINUTES_IN_A_DAY = 24 * 60;

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
      const { uri } = ctx.request.query;

      if (typeof uri !== "string" || uri.length === 0) {
        ctx.body = {
          errors: [{ message: "The `uri` query parameter is mandatory." }],
        };
        ctx.status = 400;

        return;
      }

      ctx.body = await Checkpoint.find({ uri })
        .sort({ date: -1 })
        .limit(NUMBER_OF_MINUTES_IN_A_DAY);
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
