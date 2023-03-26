const express=require('express')
const {getTechnicalData}=require('../../controllers/technical')
const {Auth,IsTechnical} =require('../../middlewares/auth')

const router=express.Router()

router.get('/get-technical-data',Auth,IsTechnical,getTechnicalData)
module.exports={get_technical_data:router}