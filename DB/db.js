const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const userSchema = new Schema({
    email: { type: String, unqiue: true },
    password: String,
    firstName: String,
    lastName: String
})

const extractedTextSchema = new Schema({
    text: String,
    userId: {
        type: ObjectId,
        ref: "user"
    }
})


const adminSchema = new Schema({
    email: { type: String, unqiue: true },
    password: String,
    firstName: String,
    lastName: String
})

const userModel = mongoose.model('user', userSchema);
const extractedTextModel = mongoose.model('extractedText', extractedTextSchema);
const adminModel = mongoose.model('admin', adminSchema);

module.exports = {
    userModel,
    extractedTextModel,
    adminModel
}