const log = require("@inspired-beings/log");
const numeral = require("numeral");

const answerWithErrors = require("../../helpers/answerWithErrors");
const Checkpoint = require("../../../shared/models/Checkpoint");

/**
 * @typedef {object} ServiceItem
 * @property {string} length
 * @property {string} uri
 */

class ApiServiceController {
  /**
   * Get a list of checkpoints from the database.
   *
   * @param {import("koa").Context} ctx
   *
   * @returns {Promise<void>}
   */
  async index(ctx) {
    try {
      if (!ctx.isAdmin) {
        ctx.status = 401;

        return;
      }

      /** @type {string[]} */
      const checkpointsWithUniqueUri = await Checkpoint.find().distinct("uri").sort();
      const checkpoints = await Promise.all(
        checkpointsWithUniqueUri.map(async uri => ({
          length: numeral((await Checkpoint.find({ uri })).length).format("0,0"),
          uri,
        })),
      );

      /** @type {ServiceItem[]} */
      const body = checkpoints;
      ctx.body = body;
    } catch (err) {
      log.err(`[web] [controllers/api/ApiServiceController#index()] Error: ${err.message}`);

      answerWithErrors(ctx, ["Please check the server logs for this error."]);
    }
  }
}

module.exports = new ApiServiceController();
