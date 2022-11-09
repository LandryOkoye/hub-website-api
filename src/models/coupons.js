const mongoose = require("mongoose");
const { getRandomKey } = require("../utils/random");

const couponSchema = mongoose.Schema(
  {
    couponCode: {
      type: String,
      default: null,
      unique: true,
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "event",
      required: true,
    },
    ticket: {
      type: String,
      enum: ["Regular", "VIP"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("coupon", couponSchema);
