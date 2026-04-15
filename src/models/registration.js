const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    reg_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "event",
      required: true,
    },
    event_name: {
      type: String,
      required: true,
      trim: true,
    },

    // ── Registrant details ──

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 255,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    responses: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

registrationSchema.index({ event_id: 1, email: 1 }, { unique: true });

registrationSchema.index({ event_id: 1 });

module.exports = mongoose.model("registrations", registrationSchema);
