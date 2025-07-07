import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import z from "zod";
import dotenv from "dotenv";
import { userModel } from "../DB/db.js";

dotenv.config();

const userRouter = express.Router();

userRouter.post('/signup', async (req, res) => {
    const requireBody = z.object({
        email: z.string().min(3).max(30).email(),
        password: z.string().min(6).max(20),
        firstName: z.string().min(5).max(50),
        lastName: z.string().min(1).max(50)
    })

    const parseDataWithSuccess = requireBody.safeParse(req.body);

    if (!parseDataWithSuccess.success) {
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
            password: hashedPassword,
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

userRouter.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const findUser = await userModel.findOne({
        email: email
    })
    
    if(!findUser){
        res.status(404).json({
            message: "User Not Found"
        })
        return
    }
    
    const passwordMatch = await bcrypt.compare(password, findUser.password);

    if(passwordMatch){
        const token = jwt.sign({
            id: findUser._id.toString()
        }, process.env.JWT_SECRET);
        res.json({
            token: token
        });
    } else {
        res.status(403).json({
            message: "Incorrect Credentials"
        })
    }
})


export { userRouter };
