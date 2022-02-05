const express = require("express");

const router = express.Router();
const isAuth = require("../middlewares/is-auth");
const apiController = require("../controllers/api");

router.get("/search/:searchQuery", isAuth, apiController.search);

router.get("/show/:showId", isAuth, apiController.showDetails);

/**
 * add rate limiting here
 */
router.get("/stream/:showId/ep/:epNo", isAuth, apiController.streamEp);

module.exports = router;
