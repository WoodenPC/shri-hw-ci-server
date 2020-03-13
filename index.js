const express = require('express');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require('./routes'));
app.use(express.static(path.resolve(__dirname, 'views/public')));

const SERVER_PORT = 3000;

app.listen(SERVER_PORT, () => {
  console.log(`listening on port ${SERVER_PORT}`);
});