const log = require("@inspired-beings/log");

const yaml = require("yaml");

const Configuration = require("../../../shared/models/Configuration");

class WebIndexController {
  /**
   * Render the index page.
   *
   * @param {import("koa").Context} ctx
   *
   * @returns {Promise<void>}
   */
  async get(ctx) {
    try {
      const configuration = await Configuration.findOne();
      if (configuration === null) {
        ctx.render("pages/index");

        return;
      }

      const { services } = yaml.parse(configuration.source);

      ctx.render("pages/index", { services });
    } catch (err) {
      log.err(`[web] [controllers/web/WebIndexController#get()] Error: ${err.message}`);

      ctx.status = 400;
    }
  }
}

module.exports = new WebIndexController();
