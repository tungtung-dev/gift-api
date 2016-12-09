import User from "../models/user";
import fetch from "node-fetch";
import {createTokenAndGetUser} from "../utils/index";

export default class AuthSocial {
    constructor(req) {
        this.social = req.body.social;
        this.token = req.body.token;
    }

    /**
     *
     * @param callback
     * @returns {*}
     */
    fetchUser(callback) {
        if (!this.social) {
            callback(new Error("Not found social field"));
        } else if (!this.token) {
            callback(new Error("Not found token field"));
        } else {
            switch (this.social) {
                case 'facebook':
                    return this.fetchUserFacebook(callback);
                case 'google':
                    return this.fetchUserGoogle(callback);
            }
        }
    }

    /**
     *
     * @param callback
     */
    fetchUserFacebook(callback) {
        fetch(`https://graph.facebook.com/v2.7/me?access_token=${this.token}&fields=id,email,birthday,name,gender,picture.type(large){url}`)
            .then(data => data.json())
            .then((userSocial)=> {
                if (userSocial.error) {
                    callback(userSocial.error);

                } else {
                    let user = Object.assign(
                        userSocial,
                        {
                            avatar_url: userSocial.picture.data.url
                        }
                    );
                    callback(null, user);
                }
            })
    }

    /**
     *
     * @param callback
     */
    fetchUserGoogle(callback) {
        fetch(`https://content-people.googleapis.com/v1/people/me?access_token=${this.token}`)
            .then(data => data.json())
            .then(userGoogle => {
                if (userGoogle.error) {
                    callback(userGoogle.error);
                } else {
                    const names = userGoogle.names[0];
                    const gender = userGoogle.genders[0].value;
                    const avatarUrl = userGoogle.photos[0].url;
                    const email = userGoogle.emailAddresses[0].value;
                    let userSocial = {
                        id: names.metadata.source.id,
                        name: names.displayName,
                        email,
                        gender,
                        avatarUrl
                    };
                    callback(null, userSocial);
                }
            })
    }

    /**
     *
     * @returns {*}
     */
    getKeySocialID() {
        switch (this.social) {
            case 'facebook':
                return 'facebookId';
                break;
            case 'google':
                return 'googleId';
            default:
                return 'facebookId';
        }
    }

    /**
     *
     * @param userInfo
     * @param callback
     */
    checkLoginUser(userInfo, callback) {
        var keySocialID = this.getKeySocialID();
        (async() => {
            try {
                let user = {
                    email: userInfo.email,
                    birthday: userInfo.birthday,
                    fullName: userInfo.name,
                    gender: userInfo.gender,
                    avatar: userInfo.avatarUrl
                };

                let userUpdated = await User.findOneAndUpdate({[keySocialID]: userInfo.id},
                    {
                        $set: user,
                        $setOnInsert: {
                            createdAt: new Date(),
                            [keySocialID]: userInfo.id
                        }
                    }, {upsert: true, new: true}).exec();
                let {token, userFromToken} = createTokenAndGetUser(userUpdated);
                callback(null, {user: userFromToken, success: true, token})
            } catch (err) {
                callback(err);
            }
        })();
    }
}