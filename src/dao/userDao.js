/**
 * Created by Tien Nguyen on 12/8/16.
 */
import {User} from '../models/index';
import bscrypt from '../utils/bcrypt';
import {createTokenAndGetUser} from "../utils/index";

export function getUserInfo(queryObj, callback) {
    User.findOne(queryObj)
        .select({password: 0})
        .exec(callback);
}

/**
 * Create the first super admin
 * @param callback
 */
export function createSuperAdmin(callback) {
    (async() => {
        let haveSuperAdmin = (await User.count({superAdmin: true}).exec()) > 0;
        if (!haveSuperAdmin) {
            let defaultPassword = 'admin';
            let hashedPassword = bscrypt.generate(defaultPassword);
            let user = new User({
                username: 'admin',
                email: 'admin@admin.com',
                password: hashedPassword,
                superAdmin: true
            });
            await user.save();
            let {token, userFromToken} = createTokenAndGetUser(user);
            callback(null, {user: userFromToken, success: true, token})
        } else {
            callback(new Error('Already have super admin'));
        }
    })();
}