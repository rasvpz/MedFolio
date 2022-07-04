const mongoose = require("mongoose");

const proCategorySchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: [true, "Please add the title"],
    },
    image: {
        type: String,
        required: [true, "Image path missing"],
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    isDisabled: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
    },
    updatedBy: {
        type: mongoose.Types.ObjectId,
    },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false },
});

proCategorySchema.pre("save", function (next) {
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    this.updatedAt = now.getTime();
    next();
});

const proCategory = mongoose.model("proCategory", proCategorySchema);
module.exports = proCategory;
