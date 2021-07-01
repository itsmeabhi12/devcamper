const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const Schema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "name cant be Empty"],
  },
  email: {
    type: String,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Not Valid Email"],
    required: [true, "PLease ENter an Email Address"],
    unique: true,
  },
  password: {
    type: String,
    select: false,
    require: [true, "Password cant be Empty"],
  },
  role: {
    type: String,
    enum: ["user", "publisher"],
    default: "user",
  },
  passwordResetToken: String,
  passwordResetExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

Schema.pre("save", async function (next) {
  // if(!this.isModified('password')){    alternative method
  //    next();
  // }
  if (!this.password) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
Schema.methods.getJWT = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

Schema.methods.checkPassword = async function (userEnteredpassowrd) {
  return await bcrypt.compare(userEnteredpassowrd, this.password);
};

Schema.methods.getResetToken = function () {
  const token = crypto.randomBytes(20).toString("hex"); //16 =hex
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.passwordResetExpire = new Date(Date.now() + 10 * 60 * 1000);

  return token;
};

module.exports = new mongoose.model("User", Schema);
