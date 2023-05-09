const express=require('express')
const {editService}=require('../../controllers/services')
const {Auth,IsTechnical} =require('../../middlewares/auth')
const {body}=require('express-validator')
const {validatereq}=require('../../middlewares/validateReq')

const router=express.Router()

router.put('/edit-service',Auth,IsTechnical,
[
    body('title').optional().isLength({min:3,max:255}).withMessage('title must be at least 3 chars long and 255 max'),
    body('description').optional().isLength({min:3}).withMessage('description must be at least 3 chars long'),
    body('serviceId').isMongoId().withMessage('serviceId must be a valid MongoDB ObjectId'),
    body('price').optional().custom((value) => {
        if(typeof value!=='number'){
            return Promise.reject('Price must be number');
        }
        return Promise.resolve()
    }),
]
,
validatereq,
editService)
module.exports={edit_service:router}