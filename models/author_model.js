const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const moment = require('moment')

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const AuthorSchema = new Schema({
    id: ObjectId,
    firstname:String,
    lastname: String,
    username: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type:String,
        enum: ['male', 'female']
    },
    bio: String,
    dob: Date,
    country: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUpdatedAt: {
        type: Date,
        default: Date.now
    }
})

AuthorSchema.plugin(passportLocalMongoose, {
    usernameField: "username"
}) //automatically handles hashing and salting of password

const Author = mongoose.model('Authors', AuthorSchema)

module.exports = Author