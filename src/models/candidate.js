const mongoose = require("mongoose");

const candidateSchema = mongoose.Schema(
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
      type : String,   
      validate : {
        validator : function (v) {
          return v.match(/^(\+234|0)[7-9]\d{9}$/);
        },
        message : 'Must be a valid Nigerian phone number'
      },
      required: true
    }
  },
  {
    timestamps: true,
  }
);

 
module.exports = mongoose.model("candidate", candidateSchema);
