import express from "express";
import {getProducts, saveProduct, updateProduct, deleteProductBySlug} from "../../dao/productDao";
import {getOrderByObject} from "../../utils/orderByManager";
import {showResultToClient} from "../../utils/responseUtils";
import {convertData, makeId} from "common-helper";
import {getCorrectState, getCorrectStateAsync} from "../../utils/stateUtils";
import {getProductBySlugOrIdRoute} from "../user/product";
import {productState} from "../../utils/constants";
import slug from "slug";
import {isObjectId} from "../../utils/objectIdUtils";

var router = express.Router();

router.get('/', function (req, res) {
    let query = req.query;
    let {categoryId} = query;
    let states = query.state !== undefined ? query.state.split(',') : [productState.PUBLIC, productState.DRAFT, productState.TRASH];
    let orderBy = getOrderByObject(req.query);
    getProducts(categoryId, query.keyword, states, query, orderBy, (err, data) => {
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
    saveProduct(data, tags, (err, data) => {
        showResultToClient(err, data, res);
    })
});

router.get('/:productKey', getProductBySlugOrIdRoute);

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
        updateProduct(queryObj, data, tags, (err, data) => {
            showResultToClient(err, data, res);
        });
    })();
});

router.delete('/:productKey', function (req, res) {
    var {productKey} = req.params;
    deleteProductBySlug(productKey, (err, data) => {
        showResultToClient(err, data, res);
    });
});

export default router;
