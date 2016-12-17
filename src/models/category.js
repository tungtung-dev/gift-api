/**
 * Created by Tien Nguyen on 9/30/16.
 */

import mongoose from "mongoose";
import config from "../config";

var {Schema} = mongoose;

var categorySchema = new Schema({
    name: {type: String},
    slug: {type: String},
    index: {type: String},
    icon: {type: String},
    featuredImage: {},
    secondaryFeaturedImage: {},
    customField: {},
    featuredImageGroup: [],
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

categorySchema.virtual('id').get(function () {
    return this._id;
});

categorySchema.virtual('imageURL').get(function () {

    return config.domainPublic + '/' + this.icon;
});

categorySchema.set('toJSON', {virtuals: true});

export default mongoose.model('category', categorySchema);
