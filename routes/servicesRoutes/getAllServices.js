const express=require('express')
const {getAllServices}=require('../../controllers/services')
const {Auth,IsClient} =require('../../middlewares/auth')
const {validatereq}=require('../../middlewares/validateReq')

const router=express.Router()

router.get('/get-services',Auth,IsClient,
validatereq,
getAllServices)
module.exports={get_services:router}