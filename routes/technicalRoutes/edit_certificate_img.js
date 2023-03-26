const express=require('express')
const {editCertificateTechnical}=require('../../controllers/technical')
const {Auth,IsTechnical} =require('../../middlewares/auth')

const router=express.Router()

router.put('/edit-certificate',Auth,IsTechnical,editCertificateTechnical)
module.exports={edit_certificate:router}