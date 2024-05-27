require('dotenv').config()
const express = require('express')
const Router = express.Router()
const User = require("../Models/UserModel").UserModel
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

Router.post("/register", async (req, res) =>
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
})
    .post("/login", async (req, res) =>
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
    })

    .post('/logout', (req, res) =>
    {
        res.clearCookie('token');
        res.json({ status: "Logout Successfully" });
    })
    .get('/profile', (req, res) =>
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
    })
    .patch('/profile/update', async (req, res) =>
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
                )
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

exports.UserRouter = Router