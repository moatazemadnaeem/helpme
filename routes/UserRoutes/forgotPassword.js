const express=require('express')
const {forgotPassword}=require('../../controllers/auth')
const {body}=require('express-validator')
const {validatereq}=require('../../middlewares/validateReq')
const router=express.Router()

router.post('/forgot-password', [
    body('email').isEmail().withMessage('Email must be valid'),
],validatereq,forgotPassword)
module.exports={forgot_password:router}