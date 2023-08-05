const ObjectId = require("mongoose").Types.ObjectId;
const loanSchema = require("../models/Loan");
const repaySchema = require("../models/Repayment");

const { loanStatus, repayStatus } = require("../utils/Factory/Enums");
const moment = require("moment");

const today = moment();
/**
 * kind: helper function
 * @param {number} amount
 * @param {number} tenure
 * @param {ObjectId} loanId
 * @returns {Array} repay
 */
const createRepaymentArray = async (amount, tenure, loanId) => {
  let repay = [];
  let repayAmount = amount / tenure;
  for (let i = 0; i < tenure; i++) {
    let nextWeek = today.add(1, "w").calendar();
    repay.push({
      loan: loanId,
      amount: repayAmount,
      serial: i,
      repayDate: nextWeek,
      status: repayStatus.APPROVAL_PENDING,
    });
  }
  return repay;
};

/**
 *
 * @param {Object} data (input from router)
 * @returns {Object} (instance of loan created)
 */
const requestLoan = async (data) => {
  try {
    const { amount, tenure, user } = data;
    if (amount <= 0 || tenure <= 0) throw new Error("Invalid tenure or amount");
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

/**
 *
 * @param {Object} data (input from router)
 * @returns {Array} (Aggregated data of all loans with respective repayments)
 * Accepts: limit, offset (for pagination)
 */
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
/**
 *
 * @param {Object} data (input from router)
 * @returns {Object} response (data for next repayments)
 */
const repayLoanById = async (data) => {
  const { loanId, amount } = data;
  //  create response skeleton object
  let response = {
    nextRepayDate: "",
    nextRepayAmount: "",
    fullyPaid: false,
    success: true,
  };
  let loanData = await loanSchema.findOne({ _id: new ObjectId(loanId) });

  if (!loanData) throw new Error("Invalid loan Id");
  if (loanData.status == loanStatus.PAID) {
    // Check if the Loan is already fully paid
    return { ...response, fullyPaid: true, success: true };
  } else {
    let repayments = await repaySchema
      .find({ loan: new ObjectId(loanId) })
      .sort({ serial: 1 });
    // find the first repayment to be made
    let paymentToMake = repayments.find(
      (item) => item.status == repayStatus.PENDING
    );
    let paymentToMakeIndex = repayments.findIndex(
      (item) => item.status == repayStatus.PENDING
    );
    if (!paymentToMake) return { ...response, fullyPaid: true, success: true };
    let amountToPay = paymentToMake.amount + (paymentToMake?.fine || 0);

    // not allow payment of amount lesser than the payable for the current repayment
    if (amount < amountToPay) {
      throw new Error("Amount is less than payable");
    }
    let extra = amount - amountToPay;

    if (extra) {
      // Deduct the extra paid amount from the next repayment
      await repaySchema.updateOne(
        {
          loan: new ObjectId(loanId),
          serial: paymentToMakeIndex + 1,
        },
        { amount: paymentToMake.amount - extra }
      );
    }
    // Mark currently paid repayment as PAID
    await repaySchema.updateOne(
      {
        loan: new ObjectId(loanId),
        serial: paymentToMakeIndex,
      },
      { status: repayStatus.PAID }
    );
    // Check if all the repayments are done, mark the loan as PAID
    if (paymentToMakeIndex == repayments.length - 1) {
      await loanSchema.updateOne(
        {
          _id: new ObjectId(loanId),
        },
        { status: loanStatus.PAID }
      );
    } else {
      response = {
        ...response,
        nextRepayDate: moment(
          repayments[paymentToMakeIndex + 1].repayDate
        ).format("YYYY-MM-DD"),
        nextRepayAmount: paymentToMake.amount - extra,
      };
    }

    return response;
  }
};

module.exports = {
  requestLoan,
  getLoanData,
  repayLoanById,
};
