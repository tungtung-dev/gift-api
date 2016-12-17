/**
 * Created by Tien Nguyen on 12/17/16.
 */
import {Order} from "../models/index";
import {orderState} from "../utils/constants";

function getOrder(query, callback) {
    Order.find(query)
        .populate({path: "user receiverInfo.card", select: {password: 0}})
        .exec(callback);
}

export function getOrderByState(state = orderState.NEED_TO_VERIFIED, callback) {
    getOrder({state: state}, callback);
}

export function getOrderByUserId(userId, callback) {
    getOrder({user: userId}, callback);
}


export function getOrderByUserAndId(userId, id, callback) {
    Order.findOne({user: userId, _id: id})
        .populate({path: "user receiverInfo.card", select: {password: 0}})
        .exec(callback);
}

export async function saveOrder(orderData, callback) {
    let order = new Order(orderData);
    order.save(callback);
}

export function updateOrderState(query, state = orderState.NEED_TO_VERIFIED, callback){
    Order.findOneAndUpdate(query, {$set: {state: state}}, {new: true})
        .populate({path: "user receiverInfo.card", select: {password: 0}})
        .exec(callback);
}