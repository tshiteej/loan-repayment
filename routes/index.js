"use strict";

const express = require("express");
const router = express.Router();

const { handleRESTReq } = require("./helpers");

const healthcheck = async () => {
  return true;
};

// @route    GET /healthcheck
// @desc     check the service health
// @access   Public
router.get("/healthcheck", handleRESTReq(healthcheck));

module.exports = router;
