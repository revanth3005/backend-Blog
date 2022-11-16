const express=require('express')

const router=express.Router()
const Login=require('../Login/login')
const middleware=require('../middleware/middleware')

router.post('/login',Login.userLogin)



module.exports=router