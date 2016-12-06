import express from "express";
import {productState} from "../../utils/constants";
import {getOrderByObject} from "../../utils/orderByManager";
import {getCards, saveCard, updateCard, deleteCardBySlug} from "../../dao/cardDao";
import {showResultToClient} from "../../utils/responseUtils";
import {getCorrectState, getCorrectStateAsync} from "../../utils/stateUtils";
import {convertData, makeId} from "common-helper";
import {isObjectId} from "../../utils/objectIdUtils";
import {getCardBySlugOrIdRoute} from "../user/card";
import slug from "slug";

var router = express.Router();

router.get('/', function (req, res) {
    let query = req.query;
    let {categoryId} = query;
    let states = query.state !== undefined ? query.state.split(',') : [productState.PUBLIC, productState.DRAFT, productState.TRASH];
    let orderBy = getOrderByObject(req.query);
    getCards(categoryId, query.keyword, states, query, orderBy, (err, data) => {
        showResultToClient(err, data, res);
    });
});

router.post('/', function (req, res) {
    let tags = req.body.tags === undefined ? [] : req.body.tags;
    let state = getCorrectState(req.body.state);
    let data = convertData(req.body, {
        title: {$get: true, $default: 'untitled'},
        description: {$get: true},
        content: {$get: true},
        state: {$set: state},
        featuredImage: {$get: true},
        secondaryFeaturedImage: {$get: true},
        customField: {$get: true},
        searchField: {
            $update: (value, objectData) => {
                return slug(objectData.title, ' ');
            }
        },
        slug: {
            $update: (value, objectData) => {
                return slug(objectData.title) + '-' + makeId();
            }
        }
    });
    saveCard(data, tags, (err, data) => {
        showResultToClient(err, data, res);
    })
});

router.get('/:productKey', getCardBySlugOrIdRoute);

router.put('/:productKey', function (req, res) {
    (async() => {
        var {productKey} = req.params;
        let tags = req.body.tags === undefined ? [] : req.body.tags;
        let isValid = isObjectId(productKey);
        let queryObj = isValid ? {_id: productKey, owner: req.user._id} : {slug: productKey, owner: req.user._id};
        let state = await getCorrectStateAsync(req.body.state);
        let data = convertData(req.body, {
            title: {$get: true},
            description: {$get: true},
            content: {$get: true},
            state: {$set: state},
            featuredImage: {$get: true},
            secondaryFeaturedImage: {$get: true},
            customField: {$get: true},
            searchField: {
                $update: (value, objectData) => {
                    return objectData.title ? slug(objectData.title, ' ') : value;
                }
            }
        });
        updateCard(queryObj, data, tags, (err, data) => {
            showResultToClient(err, data, res);
        });
    })();
});

router.delete('/:productKey', function (req, res) {
    var {productKey} = req.params;
    deleteCardBySlug(productKey, (err, data) => {
        showResultToClient(err, data, res);
    });
});


export default router;
