"use strict";

const express = require("express");
const router = express.Router();

const { handleRESTReq } = require("./helpers");
const AdminController = require("../controllers/admin");

const Validators = require("../utils/Validators");

const auth = require("../middleware/auth");

router.put(
  "/loan/status",
  auth,
  handleRESTReq(AdminController.changeLoanStatus, Validators.changeLoanStatus)
);

// router.get("/details", auth, handleRESTReq(LoanController.getLoanData));
// router.get(
//   "/repay/:loanId",
//   auth,
//   handleRESTReq(LoanController.repayLoanById, Validators.repayValidator)
// );

module.exports = router;
