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
    const { uri } = ctx.request.query;

    if (uri === undefined) {
      ctx.body = [];

      return;
    }

    const conditions = { uri };

    ctx.body = await Checkpoint.find(conditions)
      .sort({ date: -1 })
      .limit(NUMBER_OF_MINUTES_IN_A_DAY);
  }
}

module.exports = new ApiCheckpointController();
