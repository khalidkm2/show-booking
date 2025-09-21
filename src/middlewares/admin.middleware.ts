import { RequestHandler } from "express";
import { prisma } from "../config.js";
import { nextTick } from "process";


const verifyAdmin:RequestHandler = async(req,res,next) => {
    try {
        const isAdmin = await prisma.user.findFirst({
            where:{
                id:req.user?.id,
                role:"ADMIN"
            }
        })
        if(!isAdmin){
            return res.status(401).json({message:"you are not authorized "})
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"something went wrong"})
    }
}


export {
    verifyAdmin,
}