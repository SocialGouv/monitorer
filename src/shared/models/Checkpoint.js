const mongoose = require("mongoose");

const Checkpoint = mongoose.model("Checkpoint", {
  date: {
    required: true,
    type: Date,
  },
  isUp: {
    required: true,
    type: Boolean,
  },
  latency: {
    required: true,
    type: Number,
  },
  uri: {
    required: true,
    type: String,
  },
});

module.exports = Checkpoint;
