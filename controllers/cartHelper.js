const mongoose = require("mongoose");
const cart = require("../models/cart");
const product = require("../models/inventory")


const imgPath = process.env.BASE_URL;


module.exports = {
    
    checkDuplicateCart: async (data) => {
        console.log(data);
        let duplicateVariant = await cart.findOne(
            {
                $and: [
                    {userId: mongoose.Types.ObjectId(data.userId)},
                    {product_id: mongoose.Types.ObjectId(data.product_id)},
                ]

            }
        )
        
        if (duplicateVariant != null) {                
            return true;
        } else {               
            return false;
        }
        
    },
    getProductDetails: async (product_id) => {
        let data = await product.findOne({_id: mongoose.Types.ObjectId(product_id)});
        return data;
    },
    arrangeDataForCart: (data) => {
        
        return data = {
            product_id: mongoose.Types.ObjectId(data.product_id),
            uom_id: mongoose.Types.ObjectId(data.uom_id),
            userId: mongoose.Types.ObjectId(data.userId),
            quantity: Number(quantity)
        }
    },
};
