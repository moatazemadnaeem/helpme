const express=require('express')
const {editTechnicalData}=require('../../controllers/technical')
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
router.put('/edit-technical-data',
Auth,
IsTechnical,
[
    body('job').optional().notEmpty().withMessage('please provide job'),
    body('experience').optional().notEmpty().withMessage('please provide experience'),
    body('description').optional().notEmpty().withMessage('please provide description'),
    body('gender').optional().custom(validateGender).withMessage('gender must either male or female'),
    body('rangeJob').optional().custom(validateRangeJob).withMessage('rangeJob must either inside city or outside'),
    body('jobKind').optional().custom(validateTimePay).withMessage('jobKind must either hour or day'),
],
validatereq,
editTechnicalData)
module.exports={edit_technical_data:router}