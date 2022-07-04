const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
    uom_id:{
        type: String,
        required: [true,"uom id is missing"]
    },
    product_id: {
        type: mongoose.Types.ObjectId,
        required: [true,"product id is missing"]
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: [true,"user id is missing"]
       
    },
    quantity: {
        type: Number,
       
    }
})

const cart = mongoose.model("cart",cartSchema)
module.exports = cart