const express=require('express')
const {createService}=require('../../controllers/services')
const {Auth,IsTechnical} =require('../../middlewares/auth')
const {body}=require('express-validator')
const {validatereq}=require('../../middlewares/validateReq')

const router=express.Router()

router.post('/create-service',Auth,IsTechnical,
[
    body('title').isLength({min:3,max:255}).withMessage('title must be at least 3 chars long and 255 max'),
    body('description').isLength({min:3}).withMessage('description must be at least 3 chars long'),
    body('technicalId').isMongoId().withMessage('technicalId must be a valid MongoDB ObjectId'),
    body('price').custom((value) => {
        if(typeof value!=='number'){
            return Promise.reject('Price must be number');
        }
        return Promise.resolve()
    }),
]
,
validatereq,
createService)
module.exports={create_service:router}