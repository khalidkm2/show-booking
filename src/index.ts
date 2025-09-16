import express from "express";
import { prisma } from "./config.js";
import { Reservation } from "@prisma/client";

const app = express();


app.use("/",async(req,res)=>{
    res.send("hell0");

})

app.listen(3000,()=>{
    console.log("server is listening at port 3000")
})


app.post("/shows/:showId/reserve",async (req,res) =>{
    try {
        const {showId} = req.params;
        const intShowId = Number.parseInt(showId);
        const {seatId,status,userId}:Reservation = req.body;
        //checking show if it is available or not
        const show = await prisma.show.findFirst({
            where:{id:intShowId}
        })
        if(!show){
            return res.status(400).json({message:"show is not available"})
        }

        //transaction
        await prisma.$transaction(async(tx) => {
            // check seat availibility
            const seat = await tx.seat.findUnique({
                where:{
                    id:seatId
                }
            })
            if(!seat || seat.isBooked){
                throw new Error("Seat is already booked")
            }

            //update seat
            await tx.seat.update({
                where:{
                    id:seatId
                },
                data:{
                    isBooked:true,
                }
            })

            //create reservation
            const reservation = await tx.reservation.create({
                data:{
                    status,userId,seatId,showId:intShowId
                }
            })

            if(!reservation){
                throw new Error("faild to create reservation")
            }

            return res.status(200).json({data:{reservation}})
             


        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({message:"failed to book"})
    }
})