import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const users = [
    {
        fullName: "Endi Ymeri", 
        photoUrl: "https://robohash.org/ND", 
        email: "endiymeri20@gmail.com", 
        hobbies:{
            create: [
                {
                    name: "Hiking",
                    imageUrl: "https://wellness.mcmaster.ca/app/uploads/2021/09/2-720x405.png",
                    active: true
                },
                {
                    name: "Football",
                    imageUrl: "https://images.beinsports.com/pUDPpK4AaiN0fyx3IU6bKUZMmYw=/full-fit-in/1000x0/3220564-MATERAZZI_RUI_COSTA_FLARES.jpg",
                    active: true
                }
            ]
        }},
    {
        fullName: "Not Endi", 
        photoUrl: "https://robohash.org/NE", 
        email: "endiymeri@gmail.com", 
        hobbies:{
            create: [
                {
                    name: "Skiing",
                    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Ski_Famille_-_Family_Ski_Holidays.jpg/330px-Ski_Famille_-_Family_Ski_Holidays.jpg",
                    active: true
                }
            ]
        }},
    {
        fullName: "Filan Fisteku", 
        photoUrl: "https://robohash.org/FF", 
        email: "email@kot.com", 
        hobbies:{
            create: []
        }}
]

async function createUsers() {
    for(const user of users){
        await prisma.user.create({data: user})
    }
}

createUsers()