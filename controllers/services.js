const {BadReqErr}=require('../errorclasses/badReq')
const {notfound}=require('../errorclasses/notfound')
const {technical}=require('../models/TechnicalModel')
const {services}=require('../models/Services')
const {user}=require('../models/BaseModel')


module.exports={
   
    createService:async(req,res)=>{
      
        const data=req.body;

        try{
            const serviceFound=await services.find({title:data.title,technicalId:data.technicalId})
            if(serviceFound.length>0){
                throw new BadReqErr('can not add the same service please try again with another service.')
            }
            const service= await services.create(data)
            return res.status(201).send({service,msg:'service created successfully',status:true})

        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    showServicesByUser:async(req,res)=>{
        const data=req.body;//technicalId or simply the user who created this service

        try{
            const servicesFound=await services.find(data) .populate({
                path: "technicalId",
                select: "-chats -createdAt -updatedAt -uniqueString -IsValid -password -uniqueResetPassStr",
              }).select('-__v -createdAt -updatedAt ')
            const technicalData=await technical.findOne(data)
            
            res.status(200).send({services:servicesFound,...technicalData.toObject(),status:true})

        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    getAllServices: async (req, res) => {
        try {
          const mergedData = await services.aggregate([
            {
              $lookup: {
                from: "users",
                localField: "technicalId",
                foreignField: "_id",
                as: "userData",
              },
            },
            {
              $lookup: {
                from: "technicals",
                localField: "technicalId",
                foreignField: "technicalId",
                as: "techData",
              },
            },
            {
                $addFields: {
                  userData: { $arrayElemAt: ["$userData", 0] },
                  techData: { $arrayElemAt: ["$techData", 0] },
                },
            },
            {
                $project: {
                  "userData.chats": 0,
                  "userData.createdAt": 0,
                  "userData.updatedAt": 0,
                  "userData.uniqueString": 0,
                  "userData.IsValid": 0,
                  "userData.password": 0,
                  "userData.uniqueResetPassStr": 0,
                  "userData.__v": 0,
                  "techData.__v": 0,
                  "techData.createdAt": 0,
                  "techData.updatedAt": 0,
                  "techData.technicalId": 0,
                  "__v": 0,
                  "createdAt": 0,
                  "updatedAt": 0,
                  "technicalId": 0,
                },
            },
          ]);
      
          res.status(200).send({ services: mergedData, status: true });
        } catch (err) {
          throw new BadReqErr(err.message);
        }
    },
    editService:async(req,res)=>{
        const {title,description,price,serviceId}=req.body
        try{
            const service=await services.findById(serviceId)
            if(!service){
                throw new BadReqErr('can not find service data')
            }
            
            service.title=title?title:service.title;
            service.price=price?price:service.price;
            service.description=description?description:service.description;
            await service.save()
            return res.status(200).send({status:true,Service:service})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    rate_services:async(req,res)=>{
        const { stars , serviceId } = req.body;
        try{
            const service=await services.findById(serviceId)
            if(!service){
                throw new BadReqErr('can not find this technical')
            }
            // Check if user already rated
            const alreadyRated = service.ratings.rateByUser.find(r => r.userId.toString() === req.currentUser.id);
            if (alreadyRated) {
               const newRatings= service.ratings.rateByUser.filter(r => r.userId.toString() !== req.currentUser.id)
               newRatings.push({ userId: req.currentUser.id, stars })
               service.ratings.rateByUser=newRatings;
            }else{
               service.ratings.rateByUser.push({ userId: req.currentUser.id, stars })
            }
            const c= service.ratings.rateByUser.length;
            service.ratings.count=c;
            const s=service.ratings.rateByUser.map(r => r.stars)
            const avg=s.reduce((a, b) => a + b, 0)
            service.ratings.avgRating= avg / c;
            await service.save();
            return res.status(200).send({ status: true ,msg:'Rate is done successfully'});
        }catch(err){
            throw new BadReqErr(err.message)
        }
    }
      
}