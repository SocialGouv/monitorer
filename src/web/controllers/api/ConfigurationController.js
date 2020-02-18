const log = require("@inspired-beings/log");

const answerWithErrors = require("../../helpers/answerWithErrors");
const Configuration = require("../../../shared/models/Configuration");
const validateConfiguration = require("../../helpers/validateConfiguration");

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

      answerWithErrors(ctx, ["Please check the server logs for this error."]);
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
          errors: [{ message: "The `source` body property is mandatory." }],
        };
        ctx.status = 400;

        return;
      }

      const [isValid, validationErrors] = validateConfiguration(source);

      if (!isValid) {
        ctx.body = {
          errors: validationErrors,
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

      answerWithErrors(ctx, ["Please check the server logs for this error."]);
    }
  }
}

module.exports = new ApiConfigurationController();
