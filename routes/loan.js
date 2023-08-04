"use strict";

const express = require("express");
const router = express.Router();

const { handleRESTReq } = require("./helpers");
const LoanController = require("../controllers/loan");

const Validators = require("../utils/Validators");

const auth = require("../middleware/auth");

router.post(
  "/request",
  auth,
  handleRESTReq(LoanController.requestLoan, Validators.loanRequestValidator)
);

router.get("/details", auth, handleRESTReq(LoanController.getLoanData));
router.patch(
  "/repay/:loanId",
  auth,
  handleRESTReq(LoanController.repayLoanById, Validators.repayValidator)
);

module.exports = router;
