import mongoose from 'mongoose';
import {productState} from "../utils/constants";
var Schema = mongoose.Schema;

var orderSchema = new mongoose.Schema({
    receiverInfo: {
        name: {type: String, require: true},
        phone: {type: String, require: true},
        address: {type: String, require: true},
        time: {type: Date, default: Date.now},
        message: {type: String},
        card: {type: Schema.ObjectId, ref: 'card'}
    },
    cardInfo: {
        number: {type: String, require: true},
        expires: {type: String, require: true},
        ccv: {type: String, require: true},
        lastName: {type: String, require: true},
        firstName: {type: String, require: true}
    },
    user: {type: Schema.ObjectId, ref: 'user'},
    state: {type: String},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

orderSchema.set('toJSON', {virtuals: true});
orderSchema.index({searchField: 1}, {unique: false});

export default mongoose.model('order', orderSchema);
