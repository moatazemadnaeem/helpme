const express=require('express')
const router=express.Router()
const {Auth}=require('../../middlewares/auth')
const {getChats}=require('../../controllers/chat')

router.get('/get-chats',Auth,getChats)
module.exports={get_chats:router}