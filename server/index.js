const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require("./routes"));

const SERVER_PORT = 5000;

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "origin, content-type, accept");
  next();
});

app.listen(SERVER_PORT, () => {
  console.log(`listening on port ${SERVER_PORT}`);
});
