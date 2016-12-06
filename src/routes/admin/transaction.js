import express from 'express';
import categoryMock from '../../mock/transactions.json';

var router = express.Router();

router.get('/', function (req, res) {
    res.json(categoryMock);
});

router.post('/', function (req, res) {
    res.json(categoryMock[0]);
});

router.get('/:categoryKey', function (req, res) {
    res.json(categoryMock[0]);
});

router.put('/:categoryKey', function (req, res) {
    res.json(categoryMock[0]);
});

router.delete('/:categoryKey', function (req, res) {
    res.json(categoryMock[0]);
});

export default router;
