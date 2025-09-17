import express, { Application } from "express";
import bookingRouter from "./routes/booking.route.js"


const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


//routes
app.use("/api/v1/",bookingRouter);


app.listen(3000, () => {
    console.log("server is listening at port 3000")
})