const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    eventCode: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("event", eventSchema);
