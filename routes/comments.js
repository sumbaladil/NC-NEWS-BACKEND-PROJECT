const express = require("express");
const router = express.Router();
const { getAllComments } = require("../controllers");

router.get("/", getAllComments);

module.exports = router;
