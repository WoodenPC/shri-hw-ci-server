const express = require('express');
const router = express.Router();

router.use('/api', require('./api'));

app.use(express.json());
app.use(express.urlencoded());

module.exports = router;