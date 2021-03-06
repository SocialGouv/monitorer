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
      const metas = [
        { name: "service-uris", value: JSON.stringify(services.map(({ uri }) => uri)) },
      ];

      ctx.render("pages/index", { metas, services });
    } catch (err) {
      log.err(`[web] [controllers/web/WebIndexController#get()] Error: ${err.message}`);

      ctx.status = 400;
    }
  }
}

module.exports = new WebIndexController();
