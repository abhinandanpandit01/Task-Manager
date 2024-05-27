const mongoose = require("mongoose")

const TaskSchema = mongoose.Schema({
    Title: {type:String,require:true},
    Description: {type:String,require:true},
    UserName: {type:String},
    ShareUserName:{type:String}
})

exports.TaskModel = mongoose.model('tasks', TaskSchema)