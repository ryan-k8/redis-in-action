const crypto = require("crypto");

const redisClient = require("../util/redis");

const defaultCookieOptions = {
  httpOnly: true,
};

module.exports = (sessionTimeLimit) => {
  const ctl = sessionTimeLimit * 1000 || Number.MAX_SAFE_INTEGER;
  const cookieOpts = { ...defaultCookieOptions, maxAge: ctl };

  return async (req, res, next) => {
    try {
      const sessionID = req.cookies.connectSid;
      req.session = {
        save: async (data) => {
          const UUID = crypto.randomBytes(16).toString();
          await redisClient.set(UUID, JSON.stringify(data), ctl / 1000);

          res.cookie("connectSid", UUID, cookieOpts);
        },
        destroy: async () => {
          await redisClient.del(sessionID);
        },
      };

      if (sessionID) {
        let sessionData = await redisClient.get(sessionID);

        if (!sessionData) {
          sessionData = "[]";
        }

        req.session = {
          ...JSON.parse(sessionData),
          ...req.session,
        };
      }

      next();
    } catch (err) {
      console.log(err);
    }
  };
};
