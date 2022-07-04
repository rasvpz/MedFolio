const mongoose = require('mongoose')

const otpCheckingSchema = new mongoose.Schema({
    otpId: {
        type: String
    },
    phone: {
        type: String
    },
    isSigningIn: {
        type: Boolean,
        default: false
    }
})

const otpChecking = mongoose.model('otpChecking', otpCheckingSchema)
module.exports = otpChecking