const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: String,
    role: {
      type: String,
      required: true,
    },
    tokens: {
      type: [String],
      default: [],
    },
    avatar: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.deleteField = function () {
  const user = this.toObject();
  delete user.password;
  delete user.tokens;
  return user;
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema, "User");

module.exports = User;
