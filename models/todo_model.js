const mongoose = require("mongoose")
const moment = require('moment')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

// write a function that takes the first sentence in a todo's content for shortDescription
// also add a link schema tag for both the todo's content and the author

const TodoSchema = new Schema({
    id: ObjectId,
    title: String,
    shortDescription: String,
    content: String,
    created_at: {
        type: Date,
        default: Date.now
    },
    lastUpdatedAt: {
        type: Date,
        default: Date.now
    },
    category:{
        type: String,
        enum:['work','personal','spiritual','financial','lifestyle','school','career','business']
    }
})


 const Todo = mongoose.model('todos', TodoSchema)

 module.exports = Todo