/**
 * Created by Tien Nguyen on 11/18/16.
 */
import {Product, Category} from "../models/index";
import Pagination from "pagination-js";
import {ProductState} from "utils/constants";
import {isObjectId} from "utils/objectIdUtils";

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
        .populate({path: "owner", select: {password: 0}})
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
                .populate({path: "owner", select: {password: 0}})
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
 * @param ProductData
 * @param tags
 * @param callback
 */
export function saveProduct(ProductData, tags, callback) {
    (async() => {
        try {
            let categoryCount = await Category.count({_id: ProductData.categoryId}).exec();
            if (categoryCount > 0) {
                let Product = new Product(ProductData);
                await Product.save();
                Product.populate(Product, {path: 'tags owner', select: {password: 0}}, callback);
            } else {
                callback(new Error('Please check the categoryId field'));
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
            let categoryCount = await Category.count({_id: productData.categoryId}).exec();
            console.log("categoryCount " + categoryCount);
            if (productData.categoryId === undefined || productData.categoryId === null || categoryCount > 0) {
                Product.findOneAndUpdate(queryObj, {$set: productData}, {new: true})
                    .populate({path: 'tags'})
                    .populate({path: 'owner', select: {password: 0}})
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
 * @param slug slug from request
 * @param callback
 */
export function deleteProductBySlug(slug, callback) {
    Product.findOneAndRemove({slug: slug})
        .exec(callback);
}

