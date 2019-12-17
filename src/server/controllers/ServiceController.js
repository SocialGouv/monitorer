const Service = require("../../shared/models/Service");

const ServiceController = {
  index: async ctx => {
    ctx.body = await Service.find();
  }
};

module.exports = ServiceController;
