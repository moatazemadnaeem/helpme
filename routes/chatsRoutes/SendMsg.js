const express=require('express')
const {sendMsg}=require('../../controllers/chat')
const {Auth} =require('../../middlewares/auth')
const {body}=require('express-validator')
const {validatereq}=require('../../middlewares/validateReq')

const router=express.Router()

router.post('/send_msg',Auth,
[
    body('msg').isLength({min:3,max:255}).withMessage('msg must be at least 3 chars long and 255 max'),
    body('email').isEmail().withMessage('Email must be valid'),
]
,
validatereq,
sendMsg)
module.exports={send_msg:router}