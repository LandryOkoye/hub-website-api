const mongoose = require("mongoose");

const registrationsSchema = mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 255,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 255,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    couponCode: {
      type: String,
      default: null,
    },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "event" },
    transaction: {
      amount: { type: String },
      hasPaid: { type: Boolean, default: false },
    },
    ticket: {
      type: String,
      enum: ["Regular", "Vip"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("registrations", registrationsSchema);
