const Joi = require("joi");

const loanRequestValidator = Joi.object({
  amount: Joi.number().required(),
  tenure: Joi.number().required(),
}).unknown(true);

const repayValidator = Joi.object({
  amount: Joi.number().required(),
  loanId: Joi.string().required(),
});
module.exports = {
  loanRequestValidator,
  repayValidator,
};
