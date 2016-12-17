/**
 * Created by Tien Nguyen on 11/18/16.
 */
import {Card, Category} from "../models/index";
import Pagination from "pagination-js";
import {CardState} from "utils/constants";
import {isObjectId} from "utils/objectIdUtils";
import cards from '../mock/cards.json';

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
        .populate({path: "owner categories", select: {password: 0}})
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
 * @param cardData
 * @param callback
 */
export function saveCard(cardData, callback) {
    (async() => {
        try {
            let categoryCount = await Category.count({_id: {$in: cardData.categories}}).exec();
            if (categoryCount > 0 && categoryCount === cardData.categories.length) {
                let card = new Card(cardData);
                await card.save();
                Card.populate(card, {path: 'categories'}, callback);
            } else {
                callback(new Error('Please check the categories field'));
            }
        } catch (err) {
            callback(err);
        }
    })();
}

/**
 * Update Card data
 * @param queryObj
 * @param cardData
 * @param callback
 */
export function updateCard(queryObj, cardData, callback) {
    (async() => {
        try {
            let categoryCount = await Category.count({_id: {$in: cardData.categories}}).exec();
            console.log("categoryCount " + categoryCount);
            if (cardData.categories === undefined || cardData.categories === null
                || (categoryCount > 0 && categoryCount === cardData.categories.length)) {
                Card.findOneAndUpdate(queryObj, {$set: cardData}, {new: true})
                    .populate({path: 'categories'})
                    .exec(callback);
            } else {
                callback(new Error('Please check the categories field'));
            }
        } catch (err) {
            callback(err);
        }
    })();
}

/**
 * Delete Card by slug
 * @param queryObj slug from request
 * @param callback
 */
export function deleteCardBySlug(queryObj, callback) {
    Card.findOneAndRemove(queryObj)
        .exec(callback);
}

/**
 * Init Categories from
 * @param callback
 */
export async function initCards(callback) {
    try {
        let countProducts = await Card.count({}).exec();
        if (countProducts > 0) {
            callback(new Error("The products had already been initialized"));
        } else {
            for (let i = 0; i < cards.length; i++) {
                let dbObj = new Card(cards[i]);
                await dbObj.save();
            }
        }
        callback(null, {message: "The products have already been initialized"});
    } catch (err) {
        callback(err);
    }
}
