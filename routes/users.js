const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    education: {
      tenth: {
        year: Number,
        percentage: String,
      },
      twelth: {
        year: Number,
        percentage: String,
      },
      graduation: {
        year: Number,
        percentage: String,
      },
      postgraduation: {
        year: Number,
        percentage: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("registration", registrationSchema);
