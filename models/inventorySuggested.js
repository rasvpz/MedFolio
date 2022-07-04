const mongoose = require('mongoose')

const inventorySuggestedSchema = mongoose.Schema({
   
    title: {
        type: String,
        required: [true,"Title is missing"]
    },
   
})

const InventorySuggested = mongoose.model("inventorySuggested",inventorySuggestedSchema)
module.exports = InventorySuggested