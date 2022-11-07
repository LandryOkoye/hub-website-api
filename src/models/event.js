const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
  {
    couponCode: {
      type: String,
      default: null,
      unique: true,
    },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "event" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("event", eventSchema);
