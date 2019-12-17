const Checkpoint = require("../../shared/models/Checkpoint");

const CheckpointController = {
  index: async ctx => {
    ctx.body = await Checkpoint.find();
  }
};

module.exports = CheckpointController;
