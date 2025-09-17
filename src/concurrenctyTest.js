import axios from "axios"



const bookSeat = async(showId,seatId,userId) => {
    console.log("userId",userId,seatId,userId)
    try {
        const res = await axios.post(`http://localhost:3000/shows/${showId}/reserve`,{
            data:{
                seatId,
                userId
            }
        });
            console.log(`User ${userId} SUCCESS:`, res.data);
    } catch (err) {
    if (err.response) {
      console.log(`User ${userId} FAIL:`, err.response.data);
    } else {
      console.log(`User ${userId} ERROR:`, err.message);
    }
  }

}

async function main(){
    await Promise.all([
        bookSeat(1,1,10),
        bookSeat(1,1,11)

    ])
}

main()