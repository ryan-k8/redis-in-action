const express = require("express");

const isAuth = require("../middlewares/is-auth");

const router = express.Router();

router.get("/", isAuth, (req, res, next) => {
  res.status(200).json({
    message: "seeing protected stuff",
  });
});

module.exports = router;
