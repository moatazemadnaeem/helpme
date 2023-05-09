const express=require('express')
const router=express.Router()
const {Auth,IsClient}=require('../../middlewares/auth')
const {rate_services}=require('../../controllers/services')
const {body}=require('express-validator')
const {validatereq}=require('../../middlewares/validateReq')
router.post('/rate-service',Auth,IsClient,
[
    body('serviceId').isMongoId().withMessage('serviceId must be a valid MongoDB ObjectId'),
    body('stars').custom((value)=>{
        if(typeof value!=='number'){
            return Promise.reject('stars must be number')
        }
        return Promise.resolve()
    }).isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
],
validatereq,
rate_services)
module.exports={rate_service:router}