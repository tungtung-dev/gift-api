import express from 'express';


var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.json({message: 'Welcome to gift APIs'});
});

module.exports = router;