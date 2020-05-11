const express = require('express');
const cors = require('cors');
const webPush = require('web-push');

const router = require('./routes/route');
const app = express();

app.use(cors());
app.options('*', cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);

webPush.setVapidDetails('mailto:rasul-ars@mail.ru',
  'BBzTQeNBK_2hO3TDtnsl3NoGdU65Dy8s3-RCggh6e8MCWuDWf0xcG2IGux3quKOUKk-nfA38XukmhG_LEQpBWm0',
  'lAPRy352vJneCu4zgVyeK04PZN2dLoFn7kwTU9Z6SqQ'
);


const SERVER_PORT = 9999;

app.listen(SERVER_PORT, () => {
  console.log(`(push server) listening on port ${SERVER_PORT}`);
})