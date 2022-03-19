const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { InternalServerError } = require("../lib/errors");

const userSchema = mongoose.Schema(
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
    password: {
      type: String,
      default: null,
      minlength: 5,
      maxlength: 1024,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre(["save", "findOneAndUpdate"], async function (next) {
  let data = this._update || this;
  if (!data.password) next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(data.password, salt);
    data.password = hashed;

    next();
  } catch (error) {
    throw new InternalServerError(error);
  }
});

module.exports = mongoose.model("user", userSchema);
