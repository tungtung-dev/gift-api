import express from 'express';

var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
    res.json({message: 'Being implemented'});
});

export default router;
