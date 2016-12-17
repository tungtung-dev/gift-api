import express from "express";
import {adminAuthMiddleware} from "../../middlewares/adminAuthMiddleware";
import {getOrderByState, updateOrderState} from "../../dao/orderDao";
import {showResultToClient} from "../../utils/responseUtils";
import {getOrderById} from "../user/order";

var router = express.Router();

router.get('/', adminAuthMiddleware, (req, res) => {
    getOrderByState(req.query.state, (err, data) => {
        showResultToClient(err, data, res);
    });
});

router.put('/:orderKey', adminAuthMiddleware, (req, res) => {
    let {state} = req.body;
    let {orderKey} = req.params;
    updateOrderState({_id: orderKey}, state, (err, data) => {
        showResultToClient(err, data, res);
    });
});

router.get('/:orderKey', adminAuthMiddleware, getOrderById);

export default router;
