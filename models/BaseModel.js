const mongoose=require('mongoose')
const {roles}=require('../types/roles')
const {Chat}=require('./ChatUtil')
const BaseSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true,
    },
    governorate:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    number:{
        type:String,
        required:true,
    },
    role: { 
        type: String,
        enum:Object.values(roles),
        default:roles.Client
    },
    IsValid:{
        type:Boolean,
        default:false
    },
    uniqueString:{
        type:String,
    },
    imgPath:{
        type:[String],
    },
    uniqueResetPassStr:{
        type:String,
    },
    chats:{
        type:[Chat]
    },
},
{ timestamps: true })
module.exports={user:mongoose.model('User',BaseSchema)}