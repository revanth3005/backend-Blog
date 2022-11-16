const mongoose = require('mongoose')

const newSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        otp:{type:Number,required:true},
        verifyed:{type:Boolean,default:false}
    },
    {timestamps:true}

)

module.exports = mongoose.model('emailVerify',newSchema)