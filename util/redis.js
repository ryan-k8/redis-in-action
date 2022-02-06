const Redis = require("ioredis");

require("dotenv").config();

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASS,
});

module.exports = {
  get: (key) => {
    return new Promise((resolve, reject) => {
      redis.get(key, (err, result) => {
        if (err) {
          reject(err);
        }

        resolve(result);
      });
    });
  },

  getAll: () => {
    return new Promise((resolve, reject) => {
      redis.keys("*", (err, result) => {
        if (err) {
          reject(err);
        }

        resolve(result);
      });
    });
  },

  ttl: (key) => {
    return new Promise((resolve, reject) => {
      redis.ttl(key, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  },

  incr: (key) => {
    return new Promise((resolve, reject) => {
      redis.incr(key, (err, reply) => {
        if (err) {
          reject(err);
        }

        resolve(reply);
      });
    });
  },

  set: (key, value, seconds) => {
    return new Promise((resolve, reject) => {
      redis.setex(key, seconds, value, (err, result) => {
        if (err) {
          reject(err);
        }

        resolve(result);
      });
    });
  },

  del: (key) => {
    return new Promise((resolve, reject) => {
      redis
        .del(key)
        .then((result) => resolve(result))
        .catch((err) => reject(err));
    });
  },
};
