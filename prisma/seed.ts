// import { prisma } from "../src/config.js";



// async function main(){
//     //create show
//     const show = await prisma.show.create({
//         data:{title:"Interstellar",startingTime:"2025-09-14T19:00:00Z",id:2}
//     })


//     //creating seats
//     const seats = ["A1","A2","A3","A4","A5"]
//     for(const s of seats){
//         await prisma.seat.create({
//             data:{
//                 seatNo:s,
//                 showId:show.id,
//                 isBooked:false
//             }
//         })
//     }
// }


// main()
// .catch(e => {
//     console.log(e);
//     process.exit(1);
// })
// .finally(()=>{
//      prisma.$disconnect();
// })