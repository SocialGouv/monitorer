const dotenv = require("dotenv");
const log = require("@inspired-beings/log");
const path = require("path");

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.join(__dirname, "../../.env") });
}

const { MONITORER_ADMIN_USER, MONITORER_ADMIN_PASSWORD } = process.env;

const TOKEN = Buffer.from(`${MONITORER_ADMIN_USER}:${MONITORER_ADMIN_PASSWORD}`).toString("base64");
const AUTHORIZATION = `Basic ${TOKEN}`;

/**
 * Validate a YAML configuration.
 *
 * @param {import("koa").Context} ctx
 * @param {string} next
 *
 * @returns {Promise<void>}
 */
async function authenticate(ctx, next) {
  try {
    ctx.isAdmin = ctx.cookies.get("Authorization") === AUTHORIZATION;

    await next();
  } catch (err) {
    log.err(`[web] [middlewares/authenticate()] Error: ${err.message}`);
  }
}

module.exports = authenticate;
