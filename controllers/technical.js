const {BadReqErr}=require('../errorclasses/badReq')
const {notfound}=require('../errorclasses/notfound')
const {technical}=require('../models/TechnicalModel')
const {bufferToDataURI}=require('../utils/turnBuffertoDataURI')
const {uploadToCloudinary}=require('../utils/uploadImg')

module.exports={
    technicalData:async(req,res)=>{
        try{
            const exist=await technical.findOne({technicalId:req.currentUser.id})
            if(exist){
                throw new BadReqErr('you already added technical data')
            }
            let img=[];
            if(req.files){
                if(req.files.img.length===undefined){
                    img=[req.files.img];
                }else{
                    img=[...req.files.img];
                }
            }
            const Technical= await technical.create({...req.body,technicalId:req.currentUser.id})

            for(let i=0;i<img.length;i++){
                let item=img[i]
                const fileFormat = item.mimetype.split('/')[1]
                const { base64 } = bufferToDataURI(fileFormat, item.data)
                const imageDetails = await uploadToCloudinary(base64, fileFormat)
                console.log(imageDetails)
                Technical.certificate_img.push(imageDetails.url)
                await Technical.save()
            }
            return res.status(201).send({status:true,Technical})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    editCertificateTechnical:async(req,res)=>{
        const id=req.currentUser.id;
        if(!id){
            throw new BadReqErr('there is no user id')
        }
        try{
            const Technical= await technical.findOne({technicalId:id})
            if(!Technical){
                throw new notfound('not found the User')
            }
            let img=[];
            if(req.files){
                if(req.files.img.length===undefined){
                    img=[req.files.img];
                }else{
                    img=[...req.files.img];
                }
            }
            for(let i=0;i<img.length;i++){
                let item=img[i]
                const fileFormat = item.mimetype.split('/')[1]
                const { base64 } = bufferToDataURI(fileFormat, item.data)
                const imageDetails = await uploadToCloudinary(base64, fileFormat)
                console.log(imageDetails)
                Technical.certificate_img.push(imageDetails.url)
                await Technical.save()
             }
             return res.status(200).send({status:true,images:Technical.certificate_img})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    getTechnicalData:async(req,res)=>{
        const id=req.currentUser.id;
        if(!id){
            throw new BadReqErr('there is no user id')
        }
        try{
            const Technical= await technical.findOne({technicalId:id})
            if(!Technical){
                throw new notfound('not found the User')
            }
            return res.status(200).send({status:true,Technical})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    editTechnicalData:async(req,res)=>{
        const {job,experience,description,gender,rangeJob,jobKind}=req.body
        try{
            const exist=await technical.findOne({technicalId:req.currentUser.id})
            if(!exist){
                throw new BadReqErr('can not find technical data')
            }
            exist.job=job?job:exist.job;
            exist.experience=experience?experience:exist.experience;
            exist.description=description?description:exist.description;
            exist.gender=gender?gender:exist.gender;
            exist.rangeJob=rangeJob?rangeJob:exist.rangeJob;
            exist.jobKind=jobKind?jobKind:exist.jobKind;
            await exist.save()
            return res.status(201).send({status:true,Technical:exist})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
}