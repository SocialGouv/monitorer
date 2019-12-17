const log = require("@inspired-beings/log");
const dotenv = require("dotenv");
const Koa = require("koa");
const mongoose = require("mongoose");
const next = require("next");
const path = require("path");

const router = require("./router");

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve(__dirname, "../../.env") });
}

const { MONGODB_URI, NODE_ENV, WEB_PORT } = process.env;

const nextApp = next({
  dev: NODE_ENV !== "production",
  dir: path.resolve(__dirname, "../web")
});
const koaApp = new Koa();

async function start() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  log.info(`> Database connected.`);

  await nextApp.prepare();

  // Attach routes:
  koaApp.use(router(nextApp).routes());

  koaApp.listen(WEB_PORT, err => {
    if (err) throw err;

    log.info(`> Ready on http://localhost:${WEB_PORT} (${NODE_ENV}).`);
  });
}

start();
