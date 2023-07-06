const express=require('express')
const {signin}=require('../../controllers/auth')
const {validatereq}=require('../../middlewares/validateReq')
const {body}= require('express-validator') 

const router=express.Router()
function validateRole(value) {
    return ['Client', 'Technical'].includes(value);
};
router.post('/signin',
[
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({min:6,max:255}).withMessage('Password must be at least 6 chars long and 255 max'),
    body('role').custom(validateRole).withMessage('role must be either technical or client'),

],
validatereq,
signin
)
module.exports={signin:router}