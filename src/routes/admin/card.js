import express from 'express';
import cardMock from '../../mock/cards.json';

var router = express.Router();

router.get('/', function (req, res) {
    res.json(cardMock);
});

router.post('/', function (req, res) {
    res.json(cardMock.data[0]);
});

router.get('/:categoryKey', function (req, res) {
    res.json(cardMock.data[0]);
});

router.put('/:categoryKey', function (req, res) {
    res.json(cardMock.data[0]);
});

router.delete('/:categoryKey', function (req, res) {
    res.json(cardMock.data[0]);
});

export default router;
