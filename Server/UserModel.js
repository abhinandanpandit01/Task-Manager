const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
    UserName: String,
    Name: String,
    Password: String
})

exports.UserModel = mongoose.model("users", UserSchema)
