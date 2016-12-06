import {giftOrderByType} from "./constants";
/**
 * Created by Tien Nguyen on 8/17/16.
 */

/**
 * Get mongoose sorter object
 * @param query
 * @returns {*}
 */
export function getOrderByObject(query) {
    switch (query.orderByType) {
        case giftOrderByType.common.UPDATED_AT_DESC:
            return {"updatedAt": 1};
        case giftOrderByType.common.UPDATED_AT_ASC:
            return {"updatedAt": 1};
        case giftOrderByType.common.CREATED_AT_ASC:
            return {"createdAt": 1};
        case giftOrderByType.common.DEFAULT:
        case giftOrderByType.common.CREATED_AT_DESC:
            return {"createdAt": -1};
        default:
            return {"createdAt": -1};
    }
}
