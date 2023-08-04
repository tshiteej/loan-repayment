const ObjectId = require("mongoose").Types.ObjectId;
const loanSchema = require("../models/Loan");
const repaySchema = require("../models/Repayment");

const { loanStatus, repayStatus } = require("../utils/Factory/Enums");

const changeLoanStatus = async (data) => {
  try {
    const { loanId, status } = data;
    await loanSchema.updateOne(
      { _id: new ObjectId(loanId) },
      { status: loanStatus.APPROVED }
    );

    await repaySchema.updateMany(
      { loan: new ObjectId(loanId) },
      { status: status == loanStatus.APPROVED ? repayStatus.PENDING : status }
    );
    return true;
  } catch (err) {
    return err.message;
  }
};

module.exports = {
  changeLoanStatus,
};
