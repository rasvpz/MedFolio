const mongoose = require("mongoose")

const adsCartOrderReviewSchema = new mongoose.Schema({
    type: {
        type:Number,
        required: [true, "Please select the type"]        
    },
    typeId: {
        type:mongoose.Types.ObjectId,
        required: [true, "Please select the type id"]        
    },
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

adsCartOrderReviewSchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const adsCartOrderReview = mongoose.model("adsCartOrderReview",adsCartOrderReviewSchema)
module.exports = adsCartOrderReview