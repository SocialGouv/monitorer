const log = require("@inspired-beings/log");

const Configuration = require("../../../shared/models/Configuration");

class ApiConfigurationController {
  /**
   * Get the configuration source from the database.
   *
   * @param {import("koa").Context} ctx
   *
   * @returns {Promise<void>}
   */
  async get(ctx) {
    try {
      const configuration = await Configuration.findOne();

      ctx.body = configuration;
    } catch (err) {
      log.err(`[web] [controllers/api/ApiConfigurationController#get()] Error: ${err.message}`);

      ctx.status = 400;
    }
  }

  /**
   * Update the configuration source stored in database.
   *
   * @param {import("koa").Context} ctx
   *
   * @returns {Promise<void>}
   */
  async update(ctx) {
    try {
      if (!ctx.isAdmin) {
        ctx.status = 401;

        return;
      }

      const { source } = ctx.request.body;

      if (typeof source !== "string" || source.length === 0) {
        ctx.body = {
          error: "The `source` body property is mandatory.",
        };
        ctx.status = 400;

        return;
      }

      const configuration = await Configuration.findOne();
      configuration.set("source", source);
      await configuration.save();

      ctx.status = 204;
    } catch (err) {
      log.err(`[web] [controllers/api/ApiConfigurationController#update()] Error: ${err.message}`);

      ctx.status = 400;
    }
  }
}

module.exports = new ApiConfigurationController();
