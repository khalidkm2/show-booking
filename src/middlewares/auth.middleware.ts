import { RequestHandler } from "express"
import jwt from "jsonwebtoken";
import { prisma } from "../config.js";
import { decodedToken } from "../utils/types.js";


const verifyJwt:RequestHandler = async(req,res,next) => {
    try {
        // console.log("token",req.cookies.accessToken);
        const token = req.cookies?.token || req.header("authorization")?.replace("Bearer ","") 
        if(!token){
            return res.status(400).json({message:"token not found"})
        }
        const decoded = jwt.verify(token,process.env.TOKEN_SECRET as string) as decodedToken
        const user = await prisma.user.findFirst({
            where:{
                id:decoded.id
            }
        })
        if(!user){
          return res.status(401).json({message:"you are not authorized"})
        }
        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({message:"invalid access token"})
    }
}


export {
    verifyJwt
}