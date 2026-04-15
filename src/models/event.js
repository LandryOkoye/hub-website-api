const mongoose = require("mongoose");

// ─── Custom Field Sub-Schema ─────────────────────────────────────────────────
// This defines the shape of a single dynamic form field that admins
// can add to an event's registration form.
//
// When an admin creates an event, they can add extra questions like:
//   "What is your experience level?" (dropdown)
//   "Which tracks interest you?"     (checkbox)
//   "Tell us about yourself"         (textarea

const customFieldsSchema = mongoose.Schema(
  {
    field_id: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 255
    },
    type: {
      type: String,
      enum: ["dropdown", "checkbox", "textarea"],
      required: true
    },
    required: {
      type: Boolean,
      default: false
    },
    options: {
      type: [String],
      default: []
    }
  },
  {
    _id: false
  }
);

// ─── Cover Image Sub-Schema ─────────────────────────────────────────────────
// This defines the shape of a single cover image that admins
// can add to an event.

const coverImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      required: true
    }
  },
  {
    _id: false
  }
)

// ─── MainEvent Schema ─────────────────────────────────────────────────────────

const eventSchema = mongoose.Schema(
  {
    event_name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 255,
    },

    // Detailed description of the event shown on the event page
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    start_datetime: {
      type: Date,
      required: true,
    },
    end_datetime: {
      type: Date,
      required: true,
    },
    cover_image: {
      type: coverImageSchema,
      default: null,
    },
    status: {
      type: String,
      enum: ["published", "closed"],
      default: "published",
    },
    custom_fields: {
      type: [customFieldsSchema],
      default: [],
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.index({ status: 1 });
eventSchema.index({ start_datetime: 1 });
eventSchema.index({ event_name: "text", description: "text" })

module.exports = mongoose.model("event", eventSchema);
