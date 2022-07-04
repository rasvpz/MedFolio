const mongoose = require('mongoose')

const inventoryFavouriteSchema = mongoose.Schema({
   
    productUomId: {
        type: mongoose.Types.ObjectId,
        required: [true,"Product uom id is missing"]
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: [true,"userId missing"]
    }
})

const InventoryFavourites = mongoose.model("inventoryFavourites",inventoryFavouriteSchema)
module.exports = InventoryFavourites