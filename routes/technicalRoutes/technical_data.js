const express=require('express')
const {technicalData}=require('../../controllers/technical')
const {body}=require('express-validator')
const {validatereq}=require('../../middlewares/validateReq')
const {Auth,IsTechnical} =require('../../middlewares/auth')
const router=express.Router()
function validateGender(value) {
    return ['male', 'female'].includes(value);
};
function validateRangeJob(value) {
    return ['inside', 'outside'].includes(value);
};
function validateTimePay(value) {
    return ['hour', 'day'].includes(value);
};
router.post('/technical-data',
Auth,
IsTechnical,
[
    body('job').notEmpty().withMessage('please provide job'),
    body('experience').notEmpty().withMessage('please provide experience'),
    body('description').notEmpty().withMessage('please provide description'),
    body('gender').custom(validateGender).withMessage('gender must either male or female'),
    body('rangeJob').custom(validateRangeJob).withMessage('rangeJob must either inside city or outside'),
    body('jobKind').custom(validateTimePay).withMessage('jobKind must either hour or day'),
],
validatereq,
technicalData)
module.exports={technical_data:router}