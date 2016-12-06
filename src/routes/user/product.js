import express from 'express';


var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.json({message: 'Welcome to gift APIs'});
});

export default router;
