/**
 * Created by Tien Nguyen on 11/18/16.
 */
import {Product, Category} from "../models/index";
import Pagination from "pagination-js";
import {ProductState} from "utils/constants";
import {isObjectId} from "utils/objectIdUtils";
import products from '../mock/products.json';

/**
 * Count Product by query
 * @param query
 * @param callback
 */
export function countProducts(query, callback) {
    Product.count(query).exec(callback);
}

/**
 * Get Product with correct slug title
 * @param queryObj
 * @param callback
 */
export function getProductBySlug(queryObj, callback) {
    Product.findOne(queryObj)
        .populate({path: "owner categories", select: {password: 0}})
        .exec(callback);
}

/**
 * Query paginated Products
 * @param query query Object
 * @param paginationInfo include itemPerPage and page information to get pagination data
 * @param orderBy
 * @param callback
 */
export function getProductsWithPagination(query, paginationInfo, orderBy, callback) {
    (async() => {
        try {
            let count = await Product.count(query).exec();
            let pagination = (new Pagination(paginationInfo, count)).getPagination();
            Product.find(query)
                .skip(pagination.minIndex)
                .limit(pagination.itemPerPage)
                .populate({path: "owner categories", select: {password: 0}})
                .sort(orderBy)
                .exec((err, data) => {
                    callback(err, {data, pagination});
                });
        } catch (err) {
            callback(err);
        }
    })();
}

/**
 * Query paginated Products
 * @param state
 * @param paginationInfo include itemPerPage and page information to get pagination data
 * @param orderBy
 * @param callback
 */
export function getAllProductsWithPagination(state = [ProductState.PUBLIC], paginationInfo, orderBy = {createdAt: -1}, callback) {
    let query = {state: {$in: state}};
    getProductsWithPagination(query, paginationInfo, orderBy, callback);
}

/**
 *
 * @param state
 * @param keyword
 * @param paginationInfo
 * @param orderBy
 * @param callback
 */
export function searchProductsByKeyword(state = [ProductState.PUBLIC], keyword = "", paginationInfo, orderBy = {createdAt: -1}, callback) {
    let query = {$text: {$search: keyword}, state: {$in: state}};
    getProductsWithPagination(query, paginationInfo, orderBy, callback);
}


export function getProducts(category = "", keyword = "", state = [ProductState.PUBLIC], paginationInfo, orderBy = {createdAt: -1}, callback) {
    (async() => {
        try {
            let query = {};
            if (keyword === "") {
                query = {state: {$in: state}};
            } else if (keyword !== "") {
                query = {$text: {$search: keyword}, state: {$in: state}};
            }

            if (category !== "") {
                let cateQuery = isObjectId(category) ? {_id: category} : {slug: category};
                try {
                    let categoryObj = await Category.findOne(cateQuery).exec();
                    Object.assign(query, {categoryId: categoryObj._id});
                } catch (err) {
                    console.log("Not find category");
                }
            }
            getProductsWithPagination(query, paginationInfo, orderBy, callback);
        } catch (err) {
            callback(err);
        }
    })();
}

/**
 * Save Product data
 * @param productData
 * @param callback
 */
export function saveProduct(productData, callback) {
    (async() => {
        try {
            let categoryCount = await Category.count({_id: {$in: productData.categories}}).exec();
            if (categoryCount > 0 && categoryCount === productData.categories.length) {
                let product = new Product(productData);
                await product.save(callback);
                Product.populate(product, {path: 'categories'}, callback);
            } else {
                callback(new Error('Please check the categories field'));
            }
        } catch (err) {
            callback(err);
        }
    })();
}

/**
 * Update Product data
 * @param queryObj
 * @param productData
 * @param callback
 */
export function updateProduct(queryObj, productData, callback) {
    (async() => {
        try {
            let categoryCount = await Category.count({_id: {$in: productData.categories}}).exec();
            console.log("categoryCount " + categoryCount);
            if (productData.categories === undefined || productData.categories === null
                || (categoryCount > 0 && categoryCount === productData.categories.length)) {
                Product.findOneAndUpdate(queryObj, {$set: productData}, {new: true})
                    .populate({path: 'categories'})
                    .exec(callback);
            } else {
                callback(new Error('Please check the categoryId field'));
            }
        } catch (err) {
            callback(err);
        }
    })();
}

/**
 * Delete Product by slug
 * @param queryObj slug from request
 * @param callback
 */
export function deleteProductBySlug(queryObj, callback) {
    Product.findOneAndRemove(queryObj)
        .exec(callback);
}

/**
 * Init Categories from
 * @param callback
 */
export async function initProducts(callback) {
    try {
        let countProducts = await Product.count({}).exec();
        if (countProducts > 0) {
            callback(new Error("The products had already been initialized"));
        } else {
            for (let i = 0; i < products.length; i++) {
                let dbObj = new Product(products[i]);
                await dbObj.save();
            }
        }
        callback(null, {message: "The products have already been initialized"});
    } catch (err) {
        callback(err);
    }
}

