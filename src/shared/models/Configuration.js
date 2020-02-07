const mongoose = require("mongoose");

const Configuration = mongoose.model("Configuration", {
  source: {
    required: true,
    type: String,
  },
});

module.exports = Configuration;
