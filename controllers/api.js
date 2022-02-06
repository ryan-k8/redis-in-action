const axios = require("axios");
const redisClient = require("../util/redis");

exports.search = async (req, res, next) => {
  try {
    const { searchQuery } = req.params;

    const reply = await redisClient.get(searchQuery);

    if (reply) {
      return res.json(JSON.parse(reply));
    }

    const { data } = await axios.get(
      `${process.env.API_URL}/search/${searchQuery}`
    );
    await redisClient.set(searchQuery, JSON.stringify(data), 60);

    res.json(data);
  } catch (err) {
    console.log(err);
  }
};

exports.showDetails = async (req, res, next) => {
  try {
    const { showId } = req.params;

    const reply = await redisClient.get(showId);

    if (reply) {
      return res.json(JSON.parse(reply));
    }
    const { data } = await axios.get(
      `${process.env.API_URL}/getdetails/${showId}`
    );

    await redisClient.set(showId, JSON.stringify(data), 3600);
    res.json(data);
  } catch (err) {
    console.log(err);
  }
};

exports.streamEp = async (req, res, next) => {
  try {
    const { showId, epNo } = req.params;

    const reply = await redisClient.get(showId + epNo);

    if (reply) {
      return res.json(JSON.parse(reply));
    }

    const { data } = await axios.get(
      `${process.env.API_URL}/stream/${showId}/ep/${epNo}`
    );

    const cacheTime = data.episode_exists == "false" ? 3600 * 24 : 10;

    await redisClient.set(showId + epNo, JSON.stringify(data), cacheTime);
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};
