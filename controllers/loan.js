const ObjectId = require("mongoose").Types.ObjectId;
const loanSchema = require("../models/Loan");
const repaySchema = require("../models/Repayment");

const { loanStatus, repayStatus } = require("../utils/Factory/Enums");
const moment = require("moment");

const today = moment();

const createRepaymentArray = async (amount, tenure, loanId) => {
  let repay = [];
  let repayAmount = amount / tenure;
  for (let i = 0; i < tenure; i++) {
    let nextWeek = today.add(1, "w").calendar();
    repay.push({
      loan: loanId,
      amount: repayAmount,
      serial: i + 1,
      repayDate: nextWeek,
      status: repayStatus.APPROVAL_PENDING,
    });
  }
  return repay;
};
const requestLoan = async (data) => {
  try {
    const { amount, tenure, user } = data;

    const loanObject = {
      user: user.id,
      amount,
      tenure,
      status: loanStatus.PENDING,
      fine: 0,
    };
    const loanData = await loanSchema(loanObject).save();
    const repaymentArray = await createRepaymentArray(
      amount,
      tenure,
      loanData.id
    );
    let repaymentResponse = await repaySchema.insertMany(repaymentArray);
    const response = {
      loanData,
      repaymentData: repaymentResponse,
    };
    return response;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getLoanData = async (data) => {
  const { limit = 10, offset = 0, user } = data;
  const filters = [{ $match: { user: new ObjectId(user.id) } }];

  let response = await loanSchema
    .aggregate(filters)
    .skip(Number(offset))
    .limit(Number(limit))
    .sort("updatedAt")
    .lookup({
      from: "repays",
      localField: "_id",
      foreignField: "loan",
      as: "repayments",
    });

  return response;
};
module.exports = {
  requestLoan,
  getLoanData,
};
