const express=require('express')
const {verfiyUser}=require('../../controllers/auth')
const {body}=require('express-validator')
const {validatereq}=require('../../middlewares/validateReq')
const router=express.Router()

router.post('/verfiy-user', [
    body('uniqueString').notEmpty().withMessage('Please provide the correct otp or uniqueString'),
],validatereq,verfiyUser)
module.exports={verfiy_user:router}