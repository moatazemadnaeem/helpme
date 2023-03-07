const express=require('express')
const {resetPassword}=require('../../controllers/auth')
const {body}=require('express-validator')
const {validatereq}=require('../../middlewares/validateReq')
const router=express.Router()

router.post('/reset-password', [
    body('email').isEmail().withMessage('Email must be valid'),
    body('uniqueString').notEmpty().withMessage('Please provide the correct otp'),
    body('newpass').trim().isLength({min:6,max:255}).withMessage('Password must be at least 6 chars long and 255 max'),
],validatereq,resetPassword)
module.exports={reset_password:router}