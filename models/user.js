const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  phone: {
    type: String,
    required: [true, "Please enter phone number"]
  },
  password: {
    type: String,
  },
  medCoin: {
    type: Number,
  },
  active: {
    type: Boolean,
    default: true,
  },
  isGuest: {
    type: Boolean
  }
});

// userSchema.pre("save", async function(next) {
//     // check the password if it is modified
//     if (!this.isModified("password")) {
//       return next();
//     }
  
//     // Hashing the password
//     this.password = await bcrypt.hash(this.password, 12);
  
//     // Delete passwordConfirm field
//     this.passwordConfirm = undefined;
//     next();
// });
  
const user = mongoose.model("users", userSchema);
module.exports = user;