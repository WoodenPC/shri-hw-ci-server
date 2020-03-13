const express = require('express');

const app = express();
app.use(require('./routes'));

const SERVER_PORT = 3000;

app.listen(SERVER_PORT, () => {
  console.log(`listening on port ${SERVER_PORT}`);
});