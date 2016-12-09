import {processResult, getToken} from "./middlewareUtils";
import {checkAdminUser} from "./middlewareUtils";
/**
 * Verify user authentication middleware
 * @param req user request
 * @param res response
 * @param next
 * @returns {*}
 */
export function adminAuthMiddleware(req, res, next) {
    var token = getToken(req);
    checkAdminUser(token, (err, user) => {
        processResult(err, user, token, req, res, next);
    });
}