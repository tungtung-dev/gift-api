import mongoose from 'mongoose';
import {productState} from "../utils/constants";
var Schema = mongoose.Schema;

var orderSchema = new mongoose.Schema({
    title: {type: String, required: true},
    address: {type: String, required: true},
    description: {type: String},
    state: {type: String, default: productState.DRAFT},
    customer: [{type: Schema.ObjectId, ref: 'user'}],
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

orderSchema.set('toJSON', {virtuals: true});
orderSchema.index({searchField: 1}, {unique: false});

export default mongoose.model('order', orderSchema);
