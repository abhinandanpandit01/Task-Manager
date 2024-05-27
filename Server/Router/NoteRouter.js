require("dotenv").config()
const express = require("express");
const Router = express.Router()
const Task = require("../Models/TaskModel").TaskModel;
const jwt = require('jsonwebtoken')
Router.get("/task", async (req, res) =>
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
})
    .post("/add", async (req, res) =>
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
    })
    .get("/", (req, res) =>
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
    })
    .delete("/delete", async (req, res) =>
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
    })
    .patch('/Edittask', async (req, res) =>
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
    })
    .post('/share', async (req, res) =>
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

exports.NoteRouter = Router