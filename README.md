# show-booking


A. base url => http://localhost:3000/api/v1

B. end points => 
1. post /user/sign-up
    body =>{
    "name":"khalid",
    "email":"khalid@gmail.com",
    "password":"khalid@123"
}
response => {
    "message": "user registered sucessfully"
}

2. post /user/sign-in
    body => {
        "email":"khalid@gmail.com",
        "password":"khalid@123",
    }

    response => {
    "message": "user logged in successfully",
    "data": {
        "id": 1,
        "name": "khalid",
        "email": "khalid@gmail.com",
        "role": "ADMIN"
    }
}

3. post /booking/shows/:showId/reserve 
body=>{
    "data":{"seatId":1,
    "userId":1 }
}

response => {
    "data": {
        "id": 1,
        "showId": 1,
        "seatId": 1,
        "userId": 1,
        "status": "CONFIRMED"
    }
}
 4. get /booking/shows/:showId/seats

 body =>
 response =>{
    "data": [
        {
            "id": 2,
            "seatNo": "A2",
            "isBooked": false
        },
        {
            "id": 3,
            "seatNo": "A3",
            "isBooked": false
        },
        {
            "id": 4,
            "seatNo": "A4",
            "isBooked": false
        },
        ...
    ]
}

5.patch /reservations/:reservationId/cancel
body =>
response => {
    "message": "Successfully cancelled the booking."
}

6. get /shows 
body => 
response =>{
    "data": [
        {
            "id": 1,
            "title": "Avenger",
            "startingTime": "2025-09-21T14:30:00.000Z",
            "userId": 1
        }
    ]
}

get /shows/:showId 
body=>
response => {
    "data": {
        "id": 1,
        "title": "Avenger",
        "startingTime": "2025-09-21T14:30:00.000Z",
        "userId": 1
    }
}

post /shows
body=> {
  "title": "thor",
  "startingTime": "2025-09-21T14:30:00.000Z"
}
response => {
    "show": {
        "id": 2,
        "title": "thor",
        "startingTime": "2025-09-21T14:30:00.000Z",
        "userId": 1
    },
    "seatsCreated": 50
}

C. auth => i used jwt . set cookie while login("token"). client can also send header like "Bearer ". 

D. pages/Ux
   showlist,showdetails,admin(only create show for now),seat selection,checkout/reservation,my reservations, login,register,profile,you can make admin dashboard minimal for now,etc.

E. UI preferences: light mode and dark mode

F. state management : redux


