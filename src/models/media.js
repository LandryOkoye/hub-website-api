const mongoose = require("mongoose");

const mediaResourceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 255,
      trim: true,
      required: true,
    },
    url: { type: String, required: true },
    size: { type: String, required: true },
    type: { type: String, required: true },
    public_id: { type: String },
    filename: { type: String, required: true },
  },
  {
    timestamps: true,
    toObject: {
			getters: true,
			transform: function (doc, ret, game) {
        if (doc.filename) {
          const startIndex = doc.filename.lastIndexOf("\/uploads") + 1;
          const type = doc.filename.slice(startIndex);
          // console.log(type)
        }
				delete ret.__v;
				return ret;
			},
		},
  }
);

module.exports = mongoose.model("mediaResource", mediaResourceSchema);
