import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true,
  },
  firstname: {
    type: String,
  },
  username: {
    type: String,
    default: null,
  },
  active: {
    type: Boolean,
    default: true,
  },
  balance: {
    type: Number,
    default: 2000,
  },
  action: {
    type: String,
    default: "start",
  },
  name: String,
  phone: String,
});

const User = new mongoose.model("User", userSchema);

export default User;
