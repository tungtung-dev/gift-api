/**
 * Created by Tien Nguyen on 12/8/16.
 */
import {User} from '../models/index';

export function getUserInfo(queryObj, callback) {
    User.findOne(queryObj)
        .select({password: 0})
        .exec(callback);
}