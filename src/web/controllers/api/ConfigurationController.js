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
    const configuration = await Configuration.findOne();

    ctx.body = configuration;
  }

  /**
   * Update the configuration source stored in database.
   *
   * @param {import("koa").Context} ctx
   *
   * @returns {Promise<void>}
   */
  async update(ctx) {
    if (!ctx.isAdmin) {
      ctx.status = 401;

      return;
    }

    const { source } = ctx.request.body;

    try {
      const configuration = await Configuration.findOne();
      configuration.set("source", source);
      await configuration.save();

      ctx.status = 204;
    } catch (err) {
      ctx.status = 400;
    }
  }
}

module.exports = new ApiConfigurationController();
