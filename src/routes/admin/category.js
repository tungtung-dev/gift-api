import express from "express";
import {getCategoryRoute, getAllCategoriesRoute, getPaginatedCategoriesRoute} from "../user/category";
import {convertData} from "common-helper";
import {saveCategory, updateCategory, deleteCategory} from "../../dao/categoryDao";
import {showResultToClient} from "../../utils/responseUtils";
import {isObjectId} from "../../utils/objectIdUtils";
import slug from 'slug';
import {adminAuthMiddleware} from "../../middlewares/adminAuthMiddleware";

var router = express.Router();

router.get('/', adminAuthMiddleware, getPaginatedCategoriesRoute);

router.post('/', adminAuthMiddleware, function (req, res) {
    let data = convertData(req.body, {
        name: {$get: true, $default: "untitled"},
        slug: {
            $update: (value, objectData) => {
                return slug(objectData.name.toLowerCase());
            }
        },
        index: {$get: true, $default: 1},
        icon: {$get: true},
        featuredImage: {$get: true},
        secondaryFeaturedImage: {$get: true},
        customField: {$get: true}
    });
    saveCategory(data, (err, data) => {
        showResultToClient(err, data, res);
    });
});

router.get('/without-pagination', adminAuthMiddleware, getAllCategoriesRoute);

router.get('/:categoryKey', adminAuthMiddleware, getCategoryRoute);

router.put('/:categoryKey', adminAuthMiddleware, function (req, res) {
    let {categoryKey} = req.params;
    let isId = isObjectId(categoryKey);
    let queryObj = isId ? {_id: categoryKey} : {slug: categoryKey};
    let data = convertData(req.body, {
        name: {$get: true},
        slug: {
            $update: (value, objectData) => {
                return objectData.name ? slug(objectData.name.toLowerCase()) : value;
            }
        },
        index: {$get: true},
        icon: {$get: true},
        featuredImage: {$get: true},
        secondaryFeaturedImage: {$get: true},
        customField: {$get: true},
        updatedAt: {$get: true, default: new Date()}
    });
    updateCategory(queryObj, data, (err, data) => {
        showResultToClient(err, data, res);
    });
});

router.delete('/:categoryKey', adminAuthMiddleware, function (req, res) {
    let {categoryKey} = req.params;
    let isId = isObjectId(categoryKey);
    let queryObj = isId ? {_id: categoryKey} : {slug: categoryKey};
    deleteCategory(queryObj, (err, data) => {
        showResultToClient(err, data, res);
    });
});

export default router;
