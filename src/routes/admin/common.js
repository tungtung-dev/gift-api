/**
 * Created by Tien Nguyen on 12/5/16.
 */
import express from 'express';


var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.json({message: 'Welcome to gift admin APIs'});
});

export default router;
