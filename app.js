const express=require('express')
const mongoose=require('mongoose')
const http=require('http')
const cors=require('cors')

const app=express()
const server=http.createServer(app)
const PORT=3001


app.use(express.json({limit:'5mb'}))
app.use(express.urlencoded({extended:true}))
app.use(cors())

// user routes handling
const userRouter=require('./routes/userRoute')
app.use('/',userRouter)

//user login
const loginRoute=require('./routes/loginRoute')
app.use('/',loginRoute)



//MongoDB
const url='mongodb://localhost:27017/UserVerification'
mongoose.connect(url)
.then((res)=>{
    console.log(`Mongo db is connected Succesfully..${url}`);
})
.catch((error)=>{
    console.error(`Server is not connected`);
})

server.listen(PORT,()=>{
    console.log(`Express server is connected Succesfully.... on http://localhost:${PORT}`);
})