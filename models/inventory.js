const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    type: {
        type: String,
        required: [true, "Please add Product Type(Medicine/Health"]
    },
    productId: {
        type: String,
        required: [true, "Please add Product Id"]
    },
    name: {
        type: String,
        required: [true, "Please add Product Name"]
    },
    tax:{type:mongoose.Types.ObjectId },
    online:{ type: Boolean },
    offerType:{type:String},
    categories: { type: Array, ref: 'masterCategory' },
    stockAlert: { type: Number },
    statusLimit: { type: Number },
    brand: { type: mongoose.Types.ObjectId },
    policy: { type: mongoose.Types.ObjectId },
    prescription: { type: Boolean },
    description: { type: String },
    directionsOfUse: { type: String },
    content: { type: String },
    warning: { type: String },
    sideEffects: { type: String },
    metaTitles: { type: String },
    moreInfo: { type: String },
    tags: { type: Array },
    relatedProducts: [{ type: mongoose.Types.ObjectId }],
    substitutions: [{ type: mongoose.Types.ObjectId }],
    pricing: [{
        uom: { type: mongoose.Types.ObjectId },
        sku: { type: mongoose.Types.ObjectId },
        skuOrHsnNo: { type: String },
        price: { type: Number },
        specialPrice: { type: Number },
        volume: { type: Number },
        expiryDate: { type: String },
        stock: { type: Number },
        image: { type: Array },
        video: { type: String }
    }],
    isDisabled: { type: Boolean, default: false },
    createdBy: { type: mongoose.Types.ObjectId },
    updatedBy: { type: mongoose.Types.ObjectId },
    createdAt: { type: Date },
    updatedAt: { type: Date }
})

const ProductSchema = mongoose.model("products", productSchema);
module.exports = ProductSchema;