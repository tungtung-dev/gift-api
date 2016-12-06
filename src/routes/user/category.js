import express from 'express';
import categoryMock from '../../mock/categories.json';

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.json(categoryMock);
});

router.get('/:categoryKey', function (req, res) {
    res.json(categoryMock[0]);
});

export default router;
