import express from 'express';

var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.json({message: 'Being implemented'});
});

module.exports = router;
