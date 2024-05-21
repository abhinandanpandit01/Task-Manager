require('dotenv').config()
const express = require("express");
const server = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./UserModel").UserModel;
const Task = require("./TaskModel").TaskModel;
const jwt = require("jsonwebtoken");

//MiddleWares 
server.use(cors({
    origin: 'http://localhost:5173',
    credentials: true // Allow cookies to be sent
}));
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(express.json());

//User Authentication  
server.post("/register", async (req, res) =>
{
    const { UserName, Password, Name } = req.body;
    if (!UserName || !Password || !Name)
    {
        return res.status(400).json({ error: "All fields are required" });
    }
    try
    {
        const existingUser = await User.findOne({ UserName });
        if (existingUser)
        {
            return res.status(400).json({ error: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(Password, 12);
        const createdUser = new User({ UserName, Password: hashedPassword, Name });
        await createdUser.save();
        res.json({ status: "Registered Successfully", createdUser });
    } catch (error)
    {
        console.error("Error during registration:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

server.post("/login", async (req, res) =>
{
    const { UserName, Password } = req.body;
    if (!UserName || !Password)
    {
        return res.status(400).json({ error: "All fields are required" });
    }
    try
    {
        const IsUser = await User.findOne({ UserName });
        if (IsUser)
        {
            const IsPassword = await bcrypt.compare(Password, IsUser.Password);
            if (IsPassword)
            {
                jwt.sign({ Name: IsUser.Name, UserName: IsUser.UserName, Password: Password }, process.env.JWT_SECRET_KEY, {}, (err, token) =>
                {
                    if (err) return res.status(500).json({ error: "Token generation failed" });
                    res.cookie('token', token).json({ status: "Login Successfully", token });
                });
            } else
            {
                res.status(401).json({ status: "Password Incorrect" });
            }
        } else
        {
            res.status(404).json({ status: "User does not exist" });
        }
    } catch (error)
    {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

server.post('/logout', (req, res) =>
{
    res.clearCookie('token');
    res.json({ status: "Logout Successfully" });
});

server.get('/profile', (req, res) =>
{
    const { token } = req.cookies;
    if (token)
    {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) =>
        {
            if (err) return res.status(401).json({ error: "Unauthorized" });
            res.json(user);
        });
    } else
    {
        res.status(401).json({ error: "Unauthorized" });
    }
});
server.patch('/profile/update', async (req, res) =>
{
    const { Name, UserName, Password } = req.body;
    const { token } = req.cookies;

    if (!Name && !UserName && !Password)
    {
        return res.status(400).json({ error: "At least one field is required to update" });
    }
    if (!token)
    {
        return res.status(401).json({ error: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, user) =>
    {
        if (err)
        {
            return res.status(401).json({ error: "Unauthorized" });
        }

        try
        {
            const updateFields = {};
            if (Name) updateFields.Name = Name;
            if (Password)
            {
                const hashedPassword = await bcrypt.hash(Password, 12);
                updateFields.Password = hashedPassword;
            }
            const existingUser = await User.findOne({ UserName: UserName });
            if (!existingUser)
            {
                return res.status(404).json({ error: "User not found" });
            }

            const updatedUser = await User.findOneAndUpdate(
                { UserName: UserName },
                { $set: updateFields },
                { new: true }
            );
            jwt.sign({ Name: Name, UserName: UserName, Password: Password }, process.env.JWT_SECRET_KEY, {}, (err, token) =>
            {
                if (err) throw err
                res.cookie("token", token).json({ status: "Updated Successfully", User: { Name, UserName, Password }, token });
            })

        } catch (error)
        {
            console.error("Error updating profile:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
});

//Tasks
server.get("/tasks/task", async (req, res) =>
{
    const { id } = req.query;
    if (!id)
    {
        return res.status(400).json({ error: "Task ID is required" });
    }
    try
    {
        const foundTask = await Task.findById(id);
        if (foundTask)
        {
            res.json(foundTask);
        } else
        {
            res.status(404).json({ error: "Task not found" });
        }
    } catch (err)
    {
        console.error("Error finding task:", err);
        res.status(500).json({ error: "Server Error", details: err });
    }
});

server.post("/tasks/add", async (req, res) =>
{
    const { UserName, Title, Description } = req.body;
    if (!UserName || !Title || !Description)
    {
        return res.status(400).json("All fields are required");
    }
    try
    {
        const newTask = new Task({ UserName, Title, Description });
        await newTask.save();
        res.json("Added Successfully");
    } catch (err)
    {
        console.error("Error adding task:", err);
        res.status(500).json("Failed to Add");
    }
});

server.get("/tasks", (req, res) =>
{
    const { token } = req.cookies;
    if (!token)
    {
        return res.status(401).json({ error: "Unauthorized" });
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, user) =>
    {
        if (err)
        {
            console.error("JWT verification error:", err);
            return res.status(401).json({ error: 'Unauthorized' });
        }
        try
        {
            const userTasks = await Task.find({ UserName: user.Name });
            const sharedTasks = await Task.find({ UserName: user.ShareUserName });
            const allTasks = [...userTasks, ...sharedTasks];
            res.json(allTasks);
        } catch (err)
        {
            console.error("Error retrieving tasks:", err);
            res.status(500).json({ error: "Server Error", details: err });
        }
    });
});

server.delete("/tasks/delete", async (req, res) =>
{
    const { id } = req.query;
    if (!id)
    {
        return res.status(400).json({ error: "Task ID is required" });
    }
    try
    {
        const deletedTask = await Task.findByIdAndDelete(id);
        if (deletedTask)
        {
            res.json({ status: "Deleted Successfully" });
        } else
        {
            res.status(404).json({ error: "Task not found" });
        }
    } catch (err)
    {
        console.error("Error deleting task:", err);
        res.status(500).json({ error: "Server Error", details: err });
    }
});

server.patch('/tasks/Edittask', async (req, res) =>
{
    const { id } = req.query;
    const { Title, Description } = req.body;
    if (!id || !Title || !Description)
    {
        return res.status(400).json({ error: "All fields are required" });
    }
    try
    {
        const updatedTask = await Task.findByIdAndUpdate(id, { Title, Description }, { new: true });
        if (updatedTask)
        {
            res.json({ status: "Updated Successfully", updatedTask });
        } else
        {
            res.status(404).json({ error: "Task not found" });
        }
    } catch (err)
    {
        console.error("Error updating task:", err);
        res.status(500).json({ error: "Server Error", details: err });
    }
});

server.post('/tasks/share', async (req, res) =>
{
    const { Title, Description, ShareUser } = req.body;

    if (!Title || !Description || !ShareUser)
    {
        return res.status(400).json({ status: "All fields are required" });
    }

    try
    {
        const sharedTask = await Task.create({
            ShareUserName: ShareUser,
            Title: Title,
            Description: Description,
        });
        res.json({ status: "Data Send Successfully", sharedTask });
    } catch (err)
    {
        console.error("Error sharing task:", err);
        res.status(500).json({ error: "Server Error", details: err });
    }
});

// Server 
async function main()
{
    try
    {
        await mongoose.connect(process.env.MONGODB_HOST_URL, { useNewUrlParser: true, useUnifiedTopology: true });
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
