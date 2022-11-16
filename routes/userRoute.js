const express=require('express')
const router=express.Router()

const user=require('../User/user')


//testing route
router.get('/demo',user.demo)


//working-routes

//createUser
router.post('/create-user',user.createUser)
//verifyiing the mail
router.get('/:email/:otp',user.verifyEmailOtp)


module.exports=router