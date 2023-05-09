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
            return res.status(200).send({status:true,Technical:exist})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    getTechnicals:async(req,res)=>{
        try {
            const { job, experience, gender, rangeJob, jobKind, rangeAge,governorate,city,country,stars} = req.body;
    
            let query = {};
            if (job) {
                query.job = job;
            }
            if (experience) {
                query.experience = experience;
            }
            if (gender) {
                query.gender = gender;
            }
            if (rangeJob) {
                query.rangeJob = rangeJob;
            }
            if (jobKind) {
                query.jobKind = jobKind;
            }
            if (rangeAge) {
                query['user.age'] = { $gte: rangeAge[0], $lte: rangeAge[1] };
            }
            if (governorate) {
                query['user.governorate'] = governorate;
            }
            if (city) {
                query['user.city'] = city;
            }
            if (country) {
                query['user.country'] = country;
            }
            if (stars) {
                query["ratings.avgRating"] = { $exists: true, $eq: stars };
            }
            const Technicals = await technical.aggregate([
                {
                  $lookup: {
                    from: "users",
                    localField: "technicalId",
                    foreignField: "_id",
                    as: "user"
                  }
                },
                { $unwind: "$user" },
                {
                  $match: query
                },
                {
                    $project: {
                    technicalId: 0,
                    __v: 0,
                    createdAt: 0,
                    updatedAt: 0,
                    "user.password": 0,
                    "user.createdAt": 0,
                    "user.updatedAt": 0,
                    "user.__v": 0,
                    "user.password": 0,
                    "user.uniqueString": 0,
                    "user.IsValid": 0
                    }
                }
            ]);

            res.status(200).send({ success: true, data: Technicals });
        }catch (err) {
            throw new BadReqErr(err.message)
        }
    },
    rate_technicals:async(req,res)=>{
        const { stars , technicalId } = req.body;
        try{
            const tech=await technical.findById(technicalId)
            if(!tech){
                throw new BadReqErr('can not find this technical')
            }
            // Check if user already rated
            const alreadyRated = tech.ratings.rateByUser.find(r => r.userId.toString() === req.currentUser.id);
            if (alreadyRated) {
               const newRatings= tech.ratings.rateByUser.filter(r => r.userId.toString() !== req.currentUser.id)
               newRatings.push({ userId: req.currentUser.id, stars })
               tech.ratings.rateByUser=newRatings;
            }else{
               tech.ratings.rateByUser.push({ userId: req.currentUser.id, stars })
            }
            const c= tech.ratings.rateByUser.length;
            tech.ratings.count=c;
            const s=tech.ratings.rateByUser.map(r => r.stars)
            const avg=s.reduce((a, b) => a + b, 0)
            tech.ratings.avgRating= avg / c;
            await tech.save();
            return res.status(200).send({ status: true ,msg:'Rate is done successfully'});
        }catch(err){
            throw new BadReqErr(err.message)
        }
    }
}