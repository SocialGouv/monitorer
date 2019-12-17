const KoaRouter = require("koa-router");

const CheckpointController = require("./controllers/CheckpointController");
const ServiceController = require("./controllers/ServiceController");

const koaRouter = new KoaRouter();

function router(nextApp) {
  const handle = nextApp.getRequestHandler();

  koaRouter.get("/api/checkpoints", CheckpointController.index);

  koaRouter.get("/api/services", ServiceController.index);
  koaRouter.post("/api/services", ServiceController.add);
  koaRouter.patch("/api/services", ServiceController.update);
  koaRouter.delete("/api/services", ServiceController.remove);

  koaRouter.get("*", ({ req, res }) => {
    return handle(req, res);
  });

  return koaRouter;
}

module.exports = router;
