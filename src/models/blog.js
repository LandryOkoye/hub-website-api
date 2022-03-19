const mongoose = require("mongoose");
const random = require("../utils/random");
const slugify = require("../utils/slugify");

const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      minlength: 2,
      maxlength: 255,
      trim: true,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      minlength: 2,
      maxlength: 255,
      trim: true,
    },
    noOfViews: {
      type: Number,
      default: 0,
    },
    readingTime: {
      type: Number,
      required: true,
    },
    author: {
      type: String,
      minlength: 2,
      maxlength: 255,
      trim: true,
    },
    altText: { type: String, default: "" },
    url: { type: String, required: true },
    public_id: { type: String, required: true },
    status: {
      type: String,
      enum: ["Published", "Draft"],
      required: true,
    },
    content: {
      type: String,
      minlength: 2,
      trim: true,
      required: true,
    },
    publishDate: {
      type: String,
      minlength: 2,
      maxlength: 10,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.pre(["save", "findOneAndUpdate"], async function (next) {
  let data = this._update || this;
  if (!data.title) next();

  try {
    data.slug = slugify(data.title) + "-" + random();

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("blog", blogSchema);
