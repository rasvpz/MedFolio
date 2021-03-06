const mongoose = require("mongoose")

const adsBudgetStoreSchema = new mongoose.Schema({
    priceUnder: {
        type:Number,
        required: [true, "Please select the Number"]        
    },
    categoryId: [{
        type:mongoose.Types.ObjectId,
        required: [true, "Please select the categoryId"]        
     }],
    sliderType: {
        type: String
    },
    image: {
        type: String,
        required: [true, "Image path missing"]
    },      
    isDisabled: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Types.ObjectId       
    },
    updatedBy: {
        type: mongoose.Types.ObjectId               
    },  
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false }
})

adsBudgetStoreSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const adsBudgetStore = mongoose.model("adsBudgetStore",adsBudgetStoreSchema)
module.exports = adsBudgetStore