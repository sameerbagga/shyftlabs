var express = require('express');
var router = express.Router();


router.use('/students', require('./students'));
router.use('/courses', require('./courses'));
router.use('/results', require('./results'));


module.exports = router;
