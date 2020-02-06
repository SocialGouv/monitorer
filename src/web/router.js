const KoaRouter = require("koa-router");

const ApiCheckpointController = require("./controllers/api/CheckpointController");
const ApiConfigurationController = require("./controllers/api/ConfigurationController");
const WebAdminController = require("./controllers/web/AdminController");
const WebIndexController = require("./controllers/web/IndexController");

const koaRouter = new KoaRouter();

module.exports = function router() {
  koaRouter.get("/api/checkpoints", ApiCheckpointController.index);

  koaRouter.get("/api/configuration", ApiConfigurationController.get);
  koaRouter.patch("/api/configuration", ApiConfigurationController.update);

  koaRouter.get("/", WebIndexController.get);
  koaRouter.get("/admin", WebAdminController.get);

  return koaRouter.routes();
};
