import express, { Application } from "express";
import bookingRouter from "./routes/booking.route.js";
import showRouter from "./routes/show.route.js";
import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import cors from 'cors';

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // frontend origin
  credentials: true                // allow cookies/auth headers
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health",(req,res) => {
    res.json({status:"ok"})
})


//routes
app.use("/api/v1/booking",bookingRouter);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/shows", showRouter);




app.listen(3000, () => {
    console.log("server is listening at port 3000");
})