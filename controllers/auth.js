exports.login = async (req, res, next) => {
  try {
    await req.session.save({ isLoggedIn: true });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    if (!req.session.isLoggedIn) {
      return res.sendStatus(400);
    }

    await req.session.destroy();
    res.sendStatus(204);
  } catch (err) {
    console.log(err);
  }
};
