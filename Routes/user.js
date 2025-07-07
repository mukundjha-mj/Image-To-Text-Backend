import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import z from "zod";
import dotenv from "dotenv";
import { userModel } from "../DB/db";

userRoutet.post('/signup', async (req, res) => {
    const requireBody = z.object({
        email: z.string().min(3).max(30).email(),
        password: z.string().min(6).max(20),
        firstName: z.string().min(5).max(50),
        lastName: z.string().min(1).max(50)
    })

    const parseDataWithSuccess = requireBody.safeParse(req.body);

    if (!parseDataWithSuccess) {
        res.status(403).json({
            message: "Incorrect Format",
            error: parseDataWithSuccess.error
        })
        return
    }
    const { email, password, firstName, lastName } = req.body;

    let errorThrown = false;

    try {
        const hashedPassword = await bcrypt.hash(password, 5);
        await userModel.create({
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName
        })
    } catch (error) {
        res.status(208).json({
            error: "User already exist"
        })
        errorThrown = true;
    }

    if (!errorThrown) {
        res.json({ message: "!Welcome" })
    }
})