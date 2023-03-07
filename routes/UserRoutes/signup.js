const express=require('express')
const {signup}=require('../../controllers/auth')
const {body}=require('express-validator')
const {validatereq}=require('../../middlewares/validateReq')

const router=express.Router()
function validateRole(value) {
    return ['Client', 'Technical'].includes(value);
};
router.post('/signup',
[
    body('name').isLength({min:3,max:255}).withMessage('name must be at least 3 chars long and 255 max'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({min:6,max:255}).withMessage('Password must be at least 6 chars long and 255 max'),
    body('role').custom(validateRole).withMessage('role must be either developer or client')
],
validatereq,
signup)
module.exports={signup:router}