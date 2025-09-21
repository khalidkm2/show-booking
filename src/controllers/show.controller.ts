import { RequestHandler } from "express";
import { prisma } from "../config.js";
import { Prisma, Seat } from "@prisma/client";


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



const createShow: RequestHandler = async (req, res) => {
  try {
    console.log("creating shows ")
    const { title, startingTime } = req.body;
    const userId = req.user?.id; // assuming JWT middleware sets req.user

    if (!title || !startingTime) {
      return res.status(400).json({ message: "Title and startingTime are required" });
    }
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    const rows = ['A', 'B', 'C', 'D', 'E']; // fixed 5 rows
    const columns = 10; // 10 seats per row

    const result = await prisma.$transaction(async (tx) => {
      // 1️⃣ Create the show
      const show = await tx.show.create({
        data: { title, startingTime: new Date(startingTime), userId }
      });

      // 2️⃣ Generate seats
      const seatsData: Prisma.SeatCreateManyInput[] = [];
      rows.forEach(row => {
        for (let col = 1; col <= columns; col++) {
          seatsData.push({
            row,
            column: col,
            seatNo: `${row}${col}`,
            showId: show.id,
            isBooked: false
          });
        }
      });

      await tx.seat.createMany({ data: seatsData });

      return show;
    });

    res.status(201).json({ show: result, seatsCreated: rows.length * columns });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create show" });
  }
};



export default createShow;












export {
    getAllShow,
    getShow,
}