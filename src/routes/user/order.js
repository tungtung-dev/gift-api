import express from 'express';
import {authMiddleware} from "../../middlewares/authMiddleware";
import {getOrderByUserId} from "../../dao/orderDao";
import {showResultToClient} from "../../utils/responseUtils";
import {getOrderByUserAndId} from "../../dao/orderDao";
import {convertData} from "common-helper";
import {saveOrder} from "../../dao/orderDao";
import {orderState} from "../../utils/constants";


var router = express.Router();

/* GET home page. */
router.get('/', authMiddleware, (req, res) => {
    getOrderByUserId(req.user._id, (err, data)=> {
        showResultToClient(err, data, res);
    })
});

router.post('/', authMiddleware, (req, res) => {
    console.log(req.body.receiverInfo);
    let receiverInfo = convertData(req.body.receiverInfo, {
        name: {$get: true, $default: "untitled"},
        phone: {$get: true, $default: 1},
        address: {$get: true},
        time: {$get: true},
        message: {$get: true},
        card: {$get: true}
    });
    let cardInfo = convertData(req.body.cardInfo, {
        number: {$get: true},
        expires: {$get: true},
        ccv: {$get: true},
        lastName: {$get: true},
        firstName: {$get: true}
    });

    let products = req.body.products;
    let productIds = [];
    let totalPrice = 0;
    for (let i = 0; i < products.length; i++) {
        productIds.push(products[i]._id);
        totalPrice += parseFloat(products[i].price);
    }
    let order = {
        receiverInfo: receiverInfo,
        cardInfo: cardInfo,
        user: req.user._id,
        state: orderState.NEED_TO_VERIFIED,
        products: productIds,
        totalPrice: totalPrice
    };
    saveOrder(order, (err, data) => {
        showResultToClient(err, data, res);
    });
});

router.get('/:orderId', authMiddleware, getOrderById);

export function getOrderById(req, res) {
    getOrderByUserAndId(req.user._id, req.params.orderId, (err, data) => {
        showResultToClient(err, data, res);
    });
}

export default router;
