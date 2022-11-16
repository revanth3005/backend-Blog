const mongoose=require('mongoose')

const newSchema=new mongoose.Schema(
    {
        name:{type:String,required:true},
        email:{
            type:String,
            required:true,
            unique:true,
            validate:{
                validator: (value)=>
                /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value),
                message:'please enter a valid email address-----------------'
            }
        },
        password:{type:String,required:true},
        emailStatus:{type:String,default:'PENDING'},
        verified:{type:Boolean,default:false},
        isVerifiedAt:{type:Date,default:null},
        isDeletedAt:{type:Boolean,default:false}
    },
    {timestamps:true}
)

module.exports= mongoose.model('userDetails',newSchema)