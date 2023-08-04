"use strict";

const express = require("express");
const router = express.Router();

const { handleRESTReq } = require("./helpers");
const AdminController = require("../controllers/admin");

const Validators = require("../utils/Validators");

const adminAuth = require("../middleware/adminAuth");

// @route    PUT /admin/loan/status
// @desc     Admin changes the status of loan
// @access   Protected
router.put(
  "/loan/status",
  adminAuth,
  handleRESTReq(AdminController.changeLoanStatus, Validators.changeLoanStatus)
);

module.exports = router;
