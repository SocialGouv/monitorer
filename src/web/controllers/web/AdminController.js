const log = require("@inspired-beings/log");
const numeral = require("numeral");

const Checkpoint = require("../../../shared/models/Checkpoint");
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
    try {
      const { isAdmin } = ctx;

      const configuration = await Configuration.findOne();

      if (!isAdmin) {
        ctx.render("pages/admin", { configuration, isAdmin });

        return;
      }

      const checkpointsUris = await Checkpoint.find().distinct("uri").sort();
      const checkpoints = await Promise.all(
        checkpointsUris.map(async uri => ({
          length: numeral((await Checkpoint.find({ uri })).length).format("0,0"),
          uri,
        })),
      );

      const checkpointsStats = await Checkpoint.collection.stats();
      const checkpointsSize = numeral(checkpointsStats.storageSize).format("0,0.0 b");

      ctx.render("pages/admin", { checkpoints, checkpointsSize, configuration, isAdmin });
    } catch (err) {
      log.err(`[web] [controllers/web/WebAdminController#get()] Error: ${err.message}`);

      ctx.status = 400;
    }
  }
}

module.exports = new WebAdminController();
