const mongoose = require('mongoose');
const moment = require('moment-timezone');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        // required: true
    },
    password: {
        type: String,
        required: true
    },
    Phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        // required: true
    },
    state: {
        type: String,
        // required: true 
    },
    country: {
        type: String,
        // required: true               
    },
    producttype: {
        type: String,
        // required: true
    },
    registerTime: {
        type: Date,
        // default: Date.now
        default: moment().tz('America/Chicago').format()

    },
    loginTime: {
        login_time: [String]
    },
    paymentInfo: {
        type: String,
        // required: true
    },
    level: {
        type: Number,
        default: 0
    },
    period: {
        type: Number,
        default: 30
    },
    request: {
        type: Number
    }

})
module.exports = mongoose.model('Users', UserSchema)