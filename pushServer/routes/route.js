const route = require('express').Router();

const { getPushService } = require('../services/pushService');

route.post('/push', (req, res) => {
  const { buildNumber, status } = req.body;
  const pushService = getPushService();
  try {
    pushService.push(buildNumber, status);
  } catch(err) {
    console.log(err);
    return res.status(500).send(err.toString());
  }
  res.sendStatus(200);
});

route.post('/subscribe', (req, res) => {
  const subscription = req.body;
  const { data } = subscription;
  const pushService = getPushService();
  try {
    pushService.subscribe(JSON.parse(data));
  } catch(err) {
    console.log(err);
    return res.status(500).send(err.toString());
  }
  res.sendStatus(200);
});

module.exports = route;