import express from "express";
import {getProductBySlug, getProducts} from "../../dao/productDao";
import {showResultToClient} from "../../utils/responseUtils";
import {getOrderByObject} from "../../utils/orderByManager";
import {productState} from "../../utils/constants";
import {isObjectId} from "../../utils/objectIdUtils";


var router = express.Router();

router.get('/', function (req, res) {
    let {keyword, categoryId} = req.query;
    let orderBy = getOrderByObject(req.query);
    getProducts(categoryId, keyword, [productState.PUBLIC], req.query, orderBy, (err, data) => {
        showResultToClient(err, data, res);
    });
});

router.get('/:productKey', getProductBySlugOrIdRoute);

/**
 *
 * @param req
 * @param res
 */
export function getProductBySlugOrIdRoute(req, res) {
    var {productKey} = req.params;
    let isValid = isObjectId(productKey);
    let queryObj = isValid ? {_id: productKey} : {slug: productKey};
    getProductBySlug(queryObj, (err, data) => {
        showResultToClient(err, data, res);
    });
}

export default router;
