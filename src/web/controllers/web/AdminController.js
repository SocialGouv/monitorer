const Configuration = require("../../../shared/models/Configuration");

class WebAdminController {
  /**
   * Render the administration page.
   *
   * @param {import("koa").Context} ctx
   *
   * @returns {Promise<void>}
   */
  async get(ctx) {
    const configuration = await Configuration.findOne();

    await ctx.render("pages/admin", { configuration });
  }
}

module.exports = new WebAdminController();
