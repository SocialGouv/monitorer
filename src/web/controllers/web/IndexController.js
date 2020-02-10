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
    const configuration = await Configuration.findOne();
    if (configuration === null) {
      ctx.render("pages/index");

      return;
    }

    const { services } = yaml.parse(configuration.source);

    ctx.render("pages/index", { services });
  }
}

module.exports = new WebIndexController();
