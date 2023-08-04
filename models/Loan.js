const { Schema, model } = require("mongoose");
const { loanStatus } = require("../utils/Factory/Enums");

const loanSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: {
    type: Number,
    required: true,
  },
  tenure: {
    type: Number,
    required: true,
  },
  status: { type: String, required: true, enum: Object.values(loanStatus) },
  fine: { type: Number },
});

module.exports = model("Loan", loanSchema);
