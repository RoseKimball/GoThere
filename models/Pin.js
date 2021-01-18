const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;


const PinSchema = new mongoose.Schema({
    title: String,
    content: String,
    image: String,
    latitude: Number,
    longitude: Number,
    author: {type: ObjectId, ref: "User"},
    comments: [
        {
            text: String,
            createdAt: {type: Date, default: Date.now},
            author: {type: ObjectId, ref: "User"}
        }
    ]
}, {timestamps: true})

module.exports = mongoose.model("Pin", PinSchema)