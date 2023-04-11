const express=require('express')
const router=express.Router()
const {Auth,IsClient}=require('../../middlewares/auth')
const {rate_technicals}=require('../../controllers/technical')
const {body}=require('express-validator')
const {validatereq}=require('../../middlewares/validateReq')
router.post('/rate-technical',Auth,IsClient,
[
    body('technicalId').isMongoId().withMessage('technicalId must be a valid MongoDB ObjectId'),
    body('stars').custom((value)=>{
        if(typeof value!=='number'){
            return Promise.reject('stars must be number')
        }
        return Promise.resolve()
    }).isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
],
validatereq,
rate_technicals)
module.exports={rate_technical:router}