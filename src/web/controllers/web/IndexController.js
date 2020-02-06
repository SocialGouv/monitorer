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
    const { source } = await Configuration.findOne();
    const { services } = yaml.parse(source);

    await ctx.render("pages/index", { services });
  }
}

module.exports = new WebIndexController();
