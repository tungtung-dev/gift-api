/**
 * Created by Tien Nguyen on 12/8/16.
 */
import jwt from 'jsonwebtoken';
import fs from 'fs';
import request from 'request';
import config from "../config";

/**
 *
 * @param uri
 * @param filename
 * @param callback
 */
export function downloadImage(uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
}

/**
 *
 * @param user
 * @returns {{token: (number|*), user: *}}
 */
export function createTokenAndGetUser(user) {
    var token = jwt.sign(user, config.secret, {
        expiresIn: '30days' // expires in 24 hours
    });
    return {
        token,
        userFromToken: user
    };
}