const Joi = require("joi");

const loanRequestValidator = Joi.object({
  amount: Joi.number().required(),
  tenure: Joi.number().required(),
}).unknown(true);

const repayValidator = Joi.object({
  amount: Joi.number().required(),
  loanId: Joi.string().required(),
}).unknown(true);

const changeLoanStatus = Joi.object({
  loanId: Joi.string().required(),
  status: Joi.string().required(),
}).unknown(true);

module.exports = {
  loanRequestValidator,
  repayValidator,
  changeLoanStatus,
};
