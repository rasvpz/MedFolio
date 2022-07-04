const mongoose = require("mongoose");
const cart = require("../models/cart");
const product = require("../models/inventory")
const cartHelper = require("./cartHelper")


const imgPath = process.env.BASE_URL;


module.exports = {
    AddProductToCart: async (req, res, next) => {
        try {
            let data = req.body
            data.userId = req.user._id
            let duplicate = await cartHelper.checkDuplicateCart(data);  
            if (!duplicate) {                        
                let validProduct = await cartHelper.getProductDetails(data.product_id);
                if (validProduct) {
                    let newCart = new cart(cartHelper.arrangeDataForCart(data));
                                    newCart
                                    .save()
                                    .then((response) => {
                                        if (newCart.insertedId) {
                                            res.status(200).json({
                                                status: true,
                                                data:  'Product Successfully added in User Cart',
                                            });
                                        } else {
                                            res.status(200).json({
                                                status: false,
                                                data:  'Ooops!!! please try after some time',
                                            });
                                        }
                                    })
                }
            } else {
                res.status(200).json({
                    status: false,
                    data:  'product already in cart',
                });
            }  
        } catch (error) {
            next(error);
        }
    },
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
    getProductDetails: async (id) => {
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
