const router = require('express').Router();

router.use('/builds', require('./builds'));
router.use('/settings', require('./settings'));

module.exports = router;
