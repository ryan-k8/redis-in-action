const redisClient = require("../util/redis");

module.exports = ({ maxLimit, window }) => {
  return async (req, res, next) => {
    try {
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

      let reply = await redisClient.get(ip);

      if (!reply) {
        await redisClient.set(ip, 1, window);
        reply = 1;
      }

      if (parseInt(reply) > maxLimit) {
        const rateLimitExpiry = await redisClient.ttl(ip);
        res.setHeader("X-Retry-After", rateLimitExpiry);
        return res.status(429).json({
          message: "too many requests!",
        });
      }

      res.set({
        "X-Rate-Limit-Remaining": maxLimit - parseInt(reply),
        "X-Rate-Limit-Usage": parseInt(reply),
      });

      redisClient.incr(ip);

      next();
    } catch (err) {
      console.log(err);
    }
  };
};
