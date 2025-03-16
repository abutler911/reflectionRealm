// routes/index.js
const express = require('express');
const router = express.Router();

router.use('/', require('./pages'));
router.use('/api', require('./api'));

module.exports = router;