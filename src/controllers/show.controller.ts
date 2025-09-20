import { RequestHandler } from "express";
import { prisma } from "../config.js";


const getAllShow:RequestHandler = async(req,res) => {
    try {
        const shows = await prisma.show.findMany({})
        return res.status(200).json({data:shows})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"failed to fetch shows"})
    }
}



const getShow:RequestHandler = async(req,res) => {
    try {
        const {showId} = req.params;
        if(!showId){
            return res.status(400).json({message:"show id is invalid"})
        }
        const intShowId = parseInt(showId)
        const show = await prisma.show.findFirst({
            where:{id:intShowId}
        })
        return res.status(200).json({data:show})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"failed to fetch shows"})
    }
}







export {
    getAllShow,
    getShow,
}