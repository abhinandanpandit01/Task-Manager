require('dotenv').config()
const express = require("express");
const server = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { UserRouter } = require('./Router/UserRouter');
const { NoteRouter } = require('./Router/NoteRouter');
//MiddleWares 
server.use(cors({
    origin: 'http://localhost:5173',
    credentials: true // Allow cookies to be sent
}));
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(express.json());

//User Authentication  
server.use("/", UserRouter)
//Tasks
server.use('/tasks', NoteRouter)
// Server 
async function main()
{
    try
    {
        await mongoose.connect(process.env.MONGODB_HOST_URL);
        console.log("DB connected");
    } catch (err)
    {
        console.error("DB connection error:", err);
        throw err;
    }
}

main();
server.listen(process.env.LOCAL_HOST_PORT, () =>
{
    console.log("Server Started");
});
