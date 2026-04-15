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

    // = = = = = = = = = = = = =  
    // Mongodb user model updated to include  a "role " field

    // HOW ADMIN ACCESS WORKS:
    //   1. A user account is created normally via POST /api/v1/users
    //   2. You manually set their role to "admin" in MongoDB:
    //        db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
    //      OR use the provided script:  node scripts/make-admin.js admin@example.com
    //   3. When they log in, the JWT token is generated with their role included
    //   4. The requireAdmin middleware checks the role from the decoded JWT

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    }
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
