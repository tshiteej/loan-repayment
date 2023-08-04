const { Schema, model } = require("mongoose");
const { userTypes, userStatus } = require("../utils/Factory/Enums");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: userTypes.MEMBER,
    enum: Object.values(userTypes),
  },
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
    unique: true,
  },
  password: { type: String, required: true },
  status: {
    type: String,
    default: userStatus.ACTIVE,
    enum: Object.values(userStatus),
  },
});

module.exports = model("User", userSchema);
