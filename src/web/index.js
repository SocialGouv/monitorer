const dotenv = require("dotenv");
const Koa = require("koa");
const koaBodyParser = require("koa-bodyparser");
const koadArtTemplate = require("koa-art-template");
const koaStatic = require("koa-static");
const log = require("@inspired-beings/log");
const path = require("path");

const connectMongo = require("../shared/libs/connectMongo");
const router = require("./router");

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.join(__dirname, "../../.env") });
}

const { MONITORER_TITLE, NODE_ENV, PORT } = process.env;
const IS_DEV = NODE_ENV !== "production";

/**
 * Start Monitorer website server.
 *
 * @returns {Promise<void>}
 */
async function start() {
  await connectMongo();
  log.info(`> Database connected.`);

  const app = new Koa();

  koadArtTemplate(app, {
    debug: IS_DEV,
    extname: ".art",
    imports: {
      meta: {
        title: MONITORER_TITLE,
      },
    },
    root: path.join(__dirname, "views"),
  });

  app.use(koaBodyParser());
  app.use(koaStatic(path.join(__dirname, "public")));
  app.use(router());

  app.listen(PORT, err => {
    if (err) throw err;

    if (IS_DEV) log.info(`> Ready on http://localhost:${PORT} (${NODE_ENV}).`);
  });
}

start();
