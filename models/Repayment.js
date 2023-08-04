const { Schema, model } = require("mongoose");
const { repayStatus } = require("../utils/Factory/Enums");

const repaySchema = new Schema({
  loan: { type: Schema.Types.ObjectId, ref: "Loan", required: true },
  amount: {
    type: Number,
    required: true,
  },
  serial: {
    type: Number,
    required: true,
  },
  repayDate: {
    type: Date,
    required: true,
  },
  status: { type: String, required: true, enum: Object.values(repayStatus) },
  fine: { type: Number },
});

module.exports = model("Repay", repaySchema);
