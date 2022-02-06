const express = require("express");

const router = express.Router();
const isAuth = require("../middlewares/is-auth");
const rateLimiter = require("../middlewares/ratelimiter");
const apiController = require("../controllers/api");

router.get("/search/:searchQuery", isAuth, apiController.search);

router.get("/show/:showId", isAuth, apiController.showDetails);

router.get(
  "/stream/:showId/ep/:epNo",
  isAuth,
  rateLimiter({ maxLimit: 5, window: 60 }),
  apiController.streamEp
);

module.exports = router;
