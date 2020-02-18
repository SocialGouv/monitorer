/**
 * @typedef {object} Error
 * @property {string} message
 */

/**
 * Answer with errors.
 *
 * @param {import("koa").Context} ctx
 * @param {string[]} errors
 *
 * @returns {void}
 */
function answerWithErrors(ctx, errors) {
  ctx.body = {
    errors: errors.map(message => ({ message })),
  };

  ctx.status = 400;
}

module.exports = answerWithErrors;
