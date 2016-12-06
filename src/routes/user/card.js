import express from "express";
import {productState} from "../../utils/constants";
import {getOrderByObject} from "../../utils/orderByManager";
import {showResultToClient} from "../../utils/responseUtils";
import {getCards, getCardBySlug} from "../../dao/cardDao";
import {isObjectId} from "../../utils/objectIdUtils";


var router = express.Router();

router.get('/', function (req, res) {
    let {keyword, categoryId} = req.query;
    let orderBy = getOrderByObject(req.query);
    getCards(categoryId, keyword, [productState.PUBLIC], req.query, orderBy, (err, data) => {
        showResultToClient(err, data, res);
    });
});

router.get('/:productKey', getCardBySlugOrIdRoute);

/**
 *
 * @param req
 * @param res
 */
export function getCardBySlugOrIdRoute(req, res) {
    var {productKey} = req.params;
    let isValid = isObjectId(productKey);
    let queryObj = isValid ? {_id: productKey} : {slug: productKey};
    getCardBySlug(queryObj, (err, data) => {
        showResultToClient(err, data, res);
    });
}
export default router;
