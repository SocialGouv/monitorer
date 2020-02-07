const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.join(__dirname, "../../../.env") });
}

const { MONGO_URI } = process.env;

/**
 * Connect to the Mongo database.
 *
 * @returns {Promise<import("mongoose").Mongoose>}
 */
function connectMongo() {
  return mongoose.connect(MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = connectMongo;
