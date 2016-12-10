/**
 * Created by Tien Nguyen on 11/30/16.
 */
import {Category} from '../models/index';
import Pagination from 'pagination-js';
import categories from '../mock/categories.json';

/**
 * Get Categories with query and pagination
 * @param queryObj
 * @param paginationInfo
 * @param orderByObj
 * @param callback
 */
export function getCategoriesWithPagination(queryObj, paginationInfo, orderByObj, callback) {
    (async() => {
        try {
            let count = await Category.count(queryObj).exec();
            let pagination = (new Pagination(paginationInfo, count)).getPagination();
            Category.find(queryObj)
                .skip(pagination.minIndex)
                .limit(pagination.itemPerPage)
                .sort(orderByObj)
                .exec((err, data) => {
                    callback(err, err ? null : {data, pagination});
                });
        } catch (err) {
            callback(err);
        }
    })();
}

/**
 * Get Categories with query
 * @param queryObj
 * @param orderByObj
 * @param callback
 */
export function getCategoriesWithoutPagination(queryObj, orderByObj, callback) {
    Category.find(queryObj)
        .sort(orderByObj)
        .exec(callback)
}

export function getCategory(queryObj, callback) {
    Category.findOne(queryObj)
        .exec(callback);
}

/**
 * Save category
 * @param category category Object
 * @param callback
 */
export function saveCategory(category, callback) {
    (async() => {
        let count = await Category.count({slug: category.slug}).exec();
        if (count > 0) {
            callback(new Error("Tag name " + category.name + " already exists!"));
        } else {
            let obj = new Category(category);
            obj.save(callback);
        }
    })();
}

/**
 *
 * @param queryObj
 * @param category
 * @param callback
 */
export function updateCategory(queryObj, category, callback) {
    Category.findOneAndUpdate(queryObj, {$set: category}, {new: true, multi: true}).exec(callback);
}

/**
 *
 * @param queryObj
 * @param callback
 */
export function deleteCategory(queryObj, callback) {
    Category.findOneAndRemove(queryObj).exec(callback);
}

/**
 * Init Categories from
 * @param callback
 */
export function initCategories(callback) {
    (async() => {
        try {
            let countCategories = await Category.count({}).exec();
            if (countCategories > 0 ) {
                callback(new Error("The categories had already been initialized"));
            } else {
                for (let i = 0; i < categories.length; i++) {
                    let dbObj = new Category(categories[i]);
                    await dbObj.save();
                }
            }
            callback(null, {message: "The categories have already been initialized"});
        } catch (err){
            callback(err);
        }
    })();
}