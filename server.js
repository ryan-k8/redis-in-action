const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const authRoutes = require("./routes/auth");
const apiRoutes = require("./routes/api");
const sessionStore = require("./middlewares/session");

const app = express();

//when behind a proxy (heroku,nginx etc.)
app.set("trust proxy", true);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

//sets session time limit in seconds
app.use(sessionStore(7200));

app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

app.use("/", (req, res, next) => {
  res.sendStatus(404);
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((done) => {
    console.log("connected to DB!");
    app.listen(process.env.PORT, () => {
      console.log(`app listening on ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log(err));
