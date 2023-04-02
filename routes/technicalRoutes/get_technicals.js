const express=require('express')
const {getTechnicals}=require('../../controllers/technical')
const {Auth,IsTechnical} =require('../../middlewares/auth')
const {body}=require('express-validator')
const {validatereq}=require('../../middlewares/validateReq')
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
router.get('/get-technicals',Auth,
[
    body('job').optional().notEmpty().withMessage('please provide job'),
    body('experience').optional().notEmpty().withMessage('please provide experience'),
    body('gender').optional().custom(validateGender).withMessage('gender must either male or female'),
    body('rangeJob').optional().custom(validateRangeJob).withMessage('rangeJob must either inside city or outside'),
    body('jobKind').optional().custom(validateTimePay).withMessage('jobKind must either hour or day'),
    body('country').optional().isLength({min:3,max:255}).withMessage('country must be at least 3 chars long and 255 max'),
    body('governorate').optional().isLength({min:3,max:255}).withMessage('governorate must be at least 3 chars long and 255 max'),
    body('city').optional().isLength({min:3,max:255}).withMessage('city must be at least 3 chars long and 255 max'),
    body('rangeAge').optional().custom((value) => {
        if(!Array.isArray(value)||value.length!==2){
            return Promise.reject('rangeAge must be array and have two ages inside');
        }
        let valone=value[0]
        let valtwo=value[1]
        if(typeof valone!=='number'||typeof valtwo!=='number'){
            return Promise.reject('Age must be number');
        }
        if ((valone >= 15 && valone <= 90)&&(valtwo >= 15 && valtwo <= 90)) {
            return Promise.resolve()
        }
        return Promise.reject('Age must be between 15 and 90');
    }),
],
validatereq,
getTechnicals)
module.exports={get_technicals:router}