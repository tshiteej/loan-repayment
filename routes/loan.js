"use strict";

const express = require("express");
const router = express.Router();

const { handleRESTReq } = require("./helpers");
const LoanController = require("../controllers/loan");

const Validators = require("../utils/Validators");

const auth = require("../middleware/auth");

// @route    POST /loan/request
// @desc     User requests for loan approval
// @access   Protected
router.post(
  "/request",
  auth,
  handleRESTReq(LoanController.requestLoan, Validators.loanRequestValidator)
);
// @route    GET /loan/details
// @desc     User gets list of his loans and repayments
// @access   Protected
router.get("/details", auth, handleRESTReq(LoanController.getLoanData));

// @route    PATCH /loan/repay/:loadId
// @desc     User applies for repayment of loan
// @access   Protected
router.patch(
  "/repay/:loanId",
  auth,
  handleRESTReq(LoanController.repayLoanById, Validators.repayValidator)
);

module.exports = router;
