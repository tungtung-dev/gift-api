import jwt from "jsonwebtoken";
import config from "../config";
import {selectUser} from "../dao/userDao";
import {getUserInfo} from "../dao/userDao";

const AUTHORIZATION_START_POSITION = 4;

/**
 * Get token from header
 * @param req
 * @returns {*}
 */
export function getTokenFromAuthorization(req) {
    var token = req.headers['authorization'];
    if (token != null) {
        return token.substr(AUTHORIZATION_START_POSITION, token.length);
    }
    return '';
}

/**
 * Get token from user request
 * @param req
 * @returns {*}
 */
export function getToken(req) {
    var token = req.body.token || req.query.userToken || req.headers['x-access-token']
        || getTokenFromAuthorization(req);
    return token;
}

/**
 * Checking if it is Super admin
 * @param token
 * @param callback
 */
export function checkNormalUser(token, callback) {
    // Verify given token and get payload data
    if (token) {
        jwt.verify(token, config.secret, (err, payload) => {
            if (err) {
                callback(err);
            } else {
                (async() => {
                    // Query user by payload data
                    let queryObj = {_id: payload._doc._id};
                    getUserInfo(queryObj, (err, user) => {
                        if (!err && user) {
                            callback(null, user);
                        } else {
                            callback(new Error(`Not find user`));
                        }
                    });
                })();
            }
        });
    } else {
        callback(new Error(`No token provided`));
    }
}

/**
 * Checking if it is Super admin
 * @param token
 * @param callback
 */
export function checkAdminUser(token, callback) {
    // Verify given token and get payload data
    if (token) {
        jwt.verify(token, config.secret, (err, payload) => {
            if (err) {
                callback(err);
            } else {
                (async() => {
                    // Query user by payload data
                    let queryObj = {_id: payload._doc._id, superAdmin: true};
                    getUserInfo(queryObj, (err, user) => {
                        if (!err && user) {
                            callback(null, user);
                        } else {
                            callback(new Error(`Not find user`));
                        }
                    });
                })();
            }
        });
    } else {
        callback(new Error(`No token provided`));
    }
}

/**
 *
 * @param err
 * @param user
 * @param token
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
export function processResult(err, user, token, req, res, next) {
    if (err) {
        return res.json({success: false, message: err.message});
    } else {
        req.user = user;
        req.token = token;
        next();
    }
}
