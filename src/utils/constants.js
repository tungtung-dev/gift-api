/**
 * Created by Tien Nguyen on 11/22/16.
 */

export const orderState = {
    NEED_TO_VERIFIED: "order_state_need_to_verified",
    VERIFIED: "order_state_verified",
    REJECTED: "order_state_rejected"
};


export const productState = {
    DRAFT: "trans_state_draft",
    PUBLIC: "trans_state_draft",
    TRASH: "trans_state_draft"
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
