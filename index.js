const express = require('express');

const app = express();
app.use(require('./routes'));

app.use(express.json());
app.use(express.urlencoded());

const SERVER_PORT = 3000;

app.listen(SERVER_PORT, () => {
  console.log(`listening on port ${SERVER_PORT}`);
});