const mongoose = require("mongoose");

const ServiceExpectation = new mongoose.Schema({
  selector: String,
  method: String,
  value: String
});

const Service = mongoose.model("Service", {
  address: {
    type: String,
    index: true,
    unique: true,
    required: true
  },
  displayName: {
    type: String,
    unique: true,
    required: true
  },
  type: {
    type: String,
    enum: ["html", "json", "ping"],
    required: true
  },
  expectations: [ServiceExpectation]
});

module.exports = Service;
