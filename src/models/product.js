import mongoose from 'mongoose';
import {productState} from "../utils/constants";
var Schema = mongoose.Schema;

var productSchema = new mongoose.Schema({
    title: {type: String, required: true},
    slug: {type: String, required: true},
    searchField: {type: String, required: true},
    description: {type: String},
    content: {},
    state: {type: String, default: productState.DRAFT},
    customField: {},
    featuredImage: {},
    secondaryFeaturedImage: {},
    featuredImageGroup: [],
    categories: [{type: Schema.ObjectId, ref: 'category'}],
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

productSchema.set('toJSON', {virtuals: true});
productSchema.index({searchField: 1}, {unique: false});

export default mongoose.model('products', productSchema);
