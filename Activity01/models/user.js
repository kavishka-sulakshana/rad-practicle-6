const mongoose = require('mongoose');

// create schema for users collection
let userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String
});

const User = mongoose.model("user",userSchema);

module.exports = User; 

