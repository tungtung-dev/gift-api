/**
 * Created by Tien Nguyen on 11/22/16.
 */

export const transactionState = {
    DRAFT: "POST_STATE_DRAFT",
    PUBLIC: "POST_STATE_PUBLIC",
    TRASH: "POST_STATE_TRASH"
};

export const giftOrderByType = {
    common: {
        UPDATED_AT_ASC: "order_by_updated_date_asc",
        UPDATED_AT_DESC: "order_by_updated_date_desc",
        CREATED_AT_ASC: "order_by_created_date_asc",
        CREATED_AT_DESC: "order_by_created_date_desc",
        DEFAULT: "default"
    }
};
