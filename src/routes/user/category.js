import express from "express";
import {getCategoriesWithPagination, getCategory, getCategoriesWithoutPagination} from "../../dao/categoryDao";
import {showResultToClient} from "../../utils/responseUtils";
import {getOrderByObject} from "../../utils/orderByManager";
import {isObjectId} from "../../utils/objectIdUtils";

var router = express.Router();

router.get('/', getPaginatedCategoriesRoute);

router.get('/without-pagination', getAllCategoriesRoute);

router.get('/:categoryKey', getCategoryRoute);

/**
 *
 * @param req user request
 * @param res response to user
 */
export function getAllCategoriesRoute(req, res) {
    let orderBy = getOrderByObject(req.query);
    getCategoriesWithoutPagination({}, orderBy, (err, data) => {
        showResultToClient(err, data, res);
    });
}

/**
 *
 * @param req user request
 * @param res response to user
 */
export function getPaginatedCategoriesRoute(req, res) {
    let orderBy = getOrderByObject(req.query);
    getCategoriesWithPagination({}, req.query, orderBy, (err, data) => {
        showResultToClient(err, data, res);
    });
}

/**
 *
 * @param req user request
 * @param res response to user
 */
export function getCategoryRoute(req, res) {
    let {categoryKey} = req.params;
    let isId = isObjectId(categoryKey);
    let queryObj = isId ? {_id: categoryKey} : {slug: categoryKey};
    getCategory(queryObj, (err, data) => {
        showResultToClient(err, data, res);
    })
}

export default router;
