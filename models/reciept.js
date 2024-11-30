const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    upload: {
        url: { type: String, },
        filename: { type: String,  }
    },
    artType: {
        type: String,
        enum: ['30', '40', '50'],
        required: true
    },
    frameSize: {
        type: String,
        enum: ['50', '100', '150'],
        required: true
    },
    numFaces: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    whatsappNumber: {
        type: String
    },
    dateOrdered: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Receipt', receiptSchema);
