/**
 * Created by Tien Nguyen on 11/22/16.
 */
import {Post} from 'models/index';
import {productState} from "./constants";


/**
 * Check input state and correct it
 * @param inputState
 * @returns {string}
 */
export function getCorrectState(inputState = productState.DRAFT) {
    switch (inputState) {
        case productState.DRAFT:
        case productState.PUBLIC:
        case productState.TRASH:
            return inputState;
        default:
            return productState.DRAFT;
    }
}

/**
 *
 * @param inputState
 * @param postQuery
 */
export async function getCorrectStateAsync(inputState = productState.DRAFT, postQuery) {
    let post = await Post.findOne(postQuery).exec();
    let state = productState.DRAFT;
    console.log("Post state = " + post.state);
    try {
        switch (inputState) {
            case productState.DRAFT:
            case productState.PUBLIC:
            case productState.TRASH:
                state = inputState;
                break;
            default:
                state = post.state;
        }
    } catch (err) {
        state = productState.DRAFT;
    }
    return new Promise((resolve, reject) => {
        resolve(state);
    });
}
