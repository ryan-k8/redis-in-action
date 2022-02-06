const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth");
const ratelimiter = require("../middlewares/ratelimiter");

router.post(
  "/login",
  ratelimiter({ maxLimit: 3, window: 3600 }),
  authController.login
);
router.post("/logout", authController.logout);

module.exports = router;
