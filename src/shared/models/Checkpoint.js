const mongoose = require("mongoose");

const Checkpoint = mongoose.model("Checkpoint", {
  address: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  isUp: {
    type: Boolean,
    required: true
  },
  latency: {
    type: Number,
    required: true
  }
});

module.exports = Checkpoint;
