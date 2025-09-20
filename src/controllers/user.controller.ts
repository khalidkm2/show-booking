import { RequestHandler } from "express";
import { prisma } from "../config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const signUp: RequestHandler = async (req, res) => {
    try {
        const { email, password, name, } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: "all fields are required" })
        }
        //check mail if it already exits
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        })
        if (user) {
            return res.status(400).json({ message: "user already exists" })
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password:hashedPassword
            }
        })
        if (newUser) {
            return res.status(201).json({ message: "user registered sucessfully" })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "something went wrong while registering the user" })
    }
}


const signIn: RequestHandler = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "all fields are required" })
        }
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        })
        if (!user) {
            return res.status(404).json({ message: "user is not registered please signup first" })
        }
        //check password
        const isPasswordCorrect = await bcrypt.compare(password,user.password);

        if(!isPasswordCorrect){
            return res.status(401).json({message:"incorrect password . plz try again"})
        }

        //filtered user
        const {password:_,...filterdUser} = user
        
        //set cookie
        const options = {
            httpOnly: true,
            secure: true,
        };

        const token = jwt.sign({id:user.id,email:user.email,name:user.name},"secrettoken",{expiresIn:"1d"})
        return res
            .status(201)
            .cookie("token",token, options)
            .json({ message: "user logged in successfully",data:filterdUser })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "failed to login" })
    }
}


export {
    signIn,
    signUp
}