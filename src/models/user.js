/**
 * Created by Tien Nguyen on 8/20/16.
 */
import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: {type: String},
    avatar: {type: String},
    username: {type: String},
    password: {type: String},
    fullName: {type: String},
    birthday: {type: String},
    gender: {type: String},
    nickname: {type: String},
    facebook: {type: String},
    superAdmin: {type: Boolean, default: false},
    facebookId: {type: String},
    googleId: {type: String},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

userSchema.set('toJSON', {virtuals: true});

export default mongoose.model('user', userSchema);
