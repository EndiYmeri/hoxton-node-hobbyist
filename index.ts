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
    const {fullName, photoUrl, email, hobbies=[]}= req.body

    const createUser = await prisma.user.create({
        data:{
            fullName, 
            photoUrl, 
            email,
            hobbies: {
                connectOrCreate: hobbies.map((hobby:any)=>({
                    where: {name: hobby.name},
                    create: hobby
                }))
            }
        },
        include: {hobbies: true}
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

app.patch('/users/:id', async (req, res)=>{
    const id = Number(req.params.id)
    const user = await prisma.user.findFirst({
        where:{id:id},
        include: {hobbies:true}
    })
    if(user){
        const {fullName = user.fullName, photoUrl= user.photoUrl, email = user.email, hobbies=[]}= req.body
        let allHobbies :any = [...user.hobbies, ...hobbies]
        const updateUser = await prisma.user.update({
            where: { id : id },
            data:{
                fullName,
                photoUrl,
                email,
                hobbies:{
                    connectOrCreate: allHobbies.map((hobby:any)=>({
                        where :{ name: hobby.name},
                        create: hobby
                    }))
                }
            },
            include: {hobbies:true}
        })
        res.send(updateUser)
    }
    else res.status(404).send({message: "User not found"})
})

app.delete('/users/:id',async (req, res) => {
    const id = Number(req.params.id)
    const user = await prisma.user.delete({
        where: {id : id}
    })
    res.send({message: "User deleted"})
})

app.post('/addHobby', async (req, res)=>{
    const {id, hobby} = req.body
    const user = await prisma.user.update({
        where: { id: id },
        data : { 
            hobbies: {
                connectOrCreate: {
                    // @ts-ignore
                    where: { name: hobby.name  },
                    create: hobby
                }
            }
        },
        include: {hobbies : true}
    })
    res.send(user)
})

app.post('/removeHobby', async (req, res)=>{
    const {id, hobby} = req.body
    
    const user = await prisma.user.update({
        where: {id: id},
        data : { 
            hobbies: {
                // @ts-ignore
                disconnect : {name: hobby.name}
            }
        },
        include: {hobbies : true}
    })
    res.send(user)
})

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

app.delete('/hobbies/:id',async (req, res) => {
    const id = Number(req.params.id)
    const user = await prisma.hobby.delete({
        where: {id : id}
    })
    res.send({message: "Hobby deleted"})
})

app.listen(PORT, ()=>console.log(`Port on https://localhost:${PORT}`))