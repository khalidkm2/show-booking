import { RequestHandler } from "express";
import { prisma } from "../config.js";
import { Prisma, Seat } from "@prisma/client";


const getAllShow: RequestHandler = async (req, res) => {
  const { page } = req.query as { page?: string };
  console.log("pageooo",page);
  const currentPage = page ? parseInt(page, 10) : 1;
  const itemsPerPage = 6;
  try {
    console.log("shows ");
    const shows = await prisma.show.findMany({
      orderBy: { createdAt: "desc" },
      take: itemsPerPage,
      skip: (currentPage-1) * itemsPerPage
    })

    const totalShows = await prisma.show.count();

    const totalPages = Math.ceil(totalShows/itemsPerPage);

    return res.status(200).json({ data: shows,currentPage:page,totalPages })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "failed to fetch shows" })
  }
}

const getUpcomingShows: RequestHandler = async(req,res) => {
  try {
    
  } catch (error) {
    
  }
}


const getShow: RequestHandler = async (req, res) => {
  try {
    const { showId } = req.params;
    if (!showId) {
      return res.status(400).json({ message: "show id is invalid" })
    }
    const intShowId = parseInt(showId)
    const show = await prisma.show.findFirst({
      where: { id: intShowId }
    })
    return res.status(200).json({ data: show })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "failed to fetch shows" })
  }
}



const createShow: RequestHandler = async (req, res) => {
  try {
    console.log("creating shows ")
    const { title, startingTime, description, category, image, duration, rating, language } = req.body;
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
        data: { title, startingTime: new Date(startingTime), userId, description, category, image, duration, rating, language }
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


const removeShow:RequestHandler = async(req,res) => {
  try {
    const {showId} = req.params;
    const intShowId = parseInt(showId);
    const show = await prisma.show.delete({
      where:{
        id:intShowId
      }
    });
    if(show){
      return res.status(200).json({message:"show has been deleted successfully"})
    }

  } catch (error) {
    console.log(error)
    return res.status(500).json({message:"failed to delete the server"})
  }
}












export {
  createShow,
  getAllShow,
  getShow,
  removeShow
}