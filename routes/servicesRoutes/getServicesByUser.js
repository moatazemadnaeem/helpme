const express=require('express')
const {showServicesByUser}=require('../../controllers/services')
const {Auth,IsTechnical} =require('../../middlewares/auth')
const {body}=require('express-validator')
const {validatereq}=require('../../middlewares/validateReq')

const router=express.Router()

router.post('/get-services-by-user',Auth,IsTechnical,
[
    body('technicalId').isMongoId().withMessage('technicalId must be a valid MongoDB ObjectId')
]
,
validatereq,
showServicesByUser)
module.exports={get_services_by_user:router}