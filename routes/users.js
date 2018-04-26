const express = require("express");
const router = express.Router();
const { getAllUsers } = require("../controllers");

router.get("/", getAllUsers);

module.exports = router;
