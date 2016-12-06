/**
 * Created by Tien Nguyen on 11/18/16.
 */
import {Card, Category} from "../models/index";
import Pagination from "pagination-js";
import {CardState} from "utils/constants";
import {isObjectId} from "utils/objectIdUtils";

/**
 * Count Card by query
 * @param query
 * @param callback
 */
export function countCards(query, callback) {
    Card.count(query).exec(callback);
}

/**
 * Get Card with correct slug title
 * @param queryObj
 * @param callback
 */
export function getCardBySlug(queryObj, callback) {
    Card.findOne(queryObj)
        .populate({path: "owner", select: {password: 0}})
        .exec(callback);
}

/**
 * Query paginated Cards
 * @param query query Object
 * @param paginationInfo include itemPerPage and page information to get pagination data
 * @param orderBy
 * @param callback
 */
export function getCardsWithPagination(query, paginationInfo, orderBy, callback) {
    (async() => {
        try {
            let count = await Card.count(query).exec();
            let pagination = (new Pagination(paginationInfo, count)).getPagination();
            Card.find(query)
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
 * Query paginated Cards
 * @param state
 * @param paginationInfo include itemPerPage and page information to get pagination data
 * @param orderBy
 * @param callback
 */
export function getAllCardsWithPagination(state = [CardState.PUBLIC], paginationInfo, orderBy = {createdAt: -1}, callback) {
    let query = {state: {$in: state}};
    getCardsWithPagination(query, paginationInfo, orderBy, callback);
}

/**
 *
 * @param state
 * @param keyword
 * @param paginationInfo
 * @param orderBy
 * @param callback
 */
export function searchCardsByKeyword(state = [CardState.PUBLIC], keyword = "", paginationInfo, orderBy = {createdAt: -1}, callback) {
    let query = {$text: {$search: keyword}, state: {$in: state}};
    getCardsWithPagination(query, paginationInfo, orderBy, callback);
}


export function getCards(category = "", keyword = "", state = [CardState.PUBLIC], paginationInfo, orderBy = {createdAt: -1}, callback) {
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
            getCardsWithPagination(query, paginationInfo, orderBy, callback);
        } catch (err) {
            callback(err);
        }
    })();
}

/**
 * Save Card data
 * @param CardData
 * @param tags
 * @param callback
 */
export function saveCard(CardData, tags, callback) {
    (async() => {
        try {
            let categoryCount = await Category.count({_id: CardData.categoryId}).exec();
            if (categoryCount > 0) {
                let Card = new Card(CardData);
                await Card.save();
                Card.populate(Card, {path: 'tags owner', select: {password: 0}}, callback);
            } else {
                callback(new Error('Please check the categoryId field'));
            }
        } catch (err) {
            callback(err);
        }
    })();
}

/**
 * Update Card data
 * @param queryObj
 * @param CardData
 * @param callback
 */
export function updateCard(queryObj, CardData, callback) {
    (async() => {
        try {
            let categoryCount = await Category.count({_id: CardData.categoryId}).exec();
            console.log("categoryCount " + categoryCount);
            if (CardData.categoryId === undefined || CardData.categoryId === null || categoryCount > 0) {
                Card.findOneAndUpdate(queryObj, {$set: CardData}, {new: true})
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
 * Delete Card by slug
 * @param slug slug from request
 * @param callback
 */
export function deleteCardBySlug(slug, callback) {
    Card.findOneAndRemove({slug: slug})
        .exec(callback);
}

