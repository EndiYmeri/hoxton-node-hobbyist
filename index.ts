import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express from "express";

const app = express()
app.use(cors())
app.use(express.json())

const prisma = new PrismaClient()

const PORT = 8080

app.get('/users', async (req,res)=>{
    const allUsers = await prisma.user.findMany()
    res.send(allUsers)
})

app.post('/users', async (req,res) => {
    const body = req.body
    const {fullName, photoUrl, email}= body

    const createUser = await prisma.user.create({
        data:{fullName, photoUrl, email}
    })
    res.send(createUser)

})

app.get('/users/:id', async (req,res)=>{
    const id = Number(req.params.id)
    const userFound = await prisma.user.findFirst({
            where:{id: id},
            include: {hobbies:true}
        })
    res.send(userFound)
})

// app.patch('/users/:id',async (req,res) => {
//     const id = Number(req.params.id)
//     const body = req.body 
//     const hobbies = body.hobbies
//     // @ts-ignore
//     let newHobbies = hobbies.map( hobby => {
//         return { id:hobby.id}
//     })

//     const userFound = await prisma.user.findFirst({
//         where:{id: id},
//         include: {hobbies:true}
//     })
    
//     if(userFound){

//         const allHobbies = [userFound.hobbies.map(hobby=>{
//             return { id:hobby.id}
//         }), newHobbies]
//         // const oldHobbies = prisma.user.findFirst({
//             //     where:{id:id}
//             // })
            
//             const updatedUser = await prisma.user.update({
//                 where:{id: id},
//         data:{
//             hobbies:{
//                 set:  allHobbies
//             }
//         }
//     })
//     res.send(updatedUser)
//     }   

// })




app.get('/hobbies', async (req,res)=>{
    const allUsers = await prisma.hobby.findMany()
    res.send(allUsers)
})

app.post('/hobbies', async (req,res) => {
    const body = req.body
    const createHobby = await prisma.hobby.create({
        data:{
            name:body.name,
            imageUrl: body.imageUrl,
            active: body.active
        }
    })
    res.send(createHobby)
})


app.get('/hobbies/:id', async (req,res)=>{
    const id = Number(req.params.id)
    const hobbyFound = await prisma.hobby.findFirst({
        where:{id: id},
        include:{users:true}
    })
    res.send(hobbyFound)
})





app.listen(PORT, ()=>console.log(`Port on https://localhost:${PORT}`))