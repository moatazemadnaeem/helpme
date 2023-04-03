const {BadReqErr}=require('../errorclasses/badReq')
const {notfound}=require('../errorclasses/notfound')
const {user}=require('../models/BaseModel')
const {hashPass,comparePass}=require('../utils/password')
const jwt =require('jsonwebtoken')
const {GetRandString}=require('../utils/randomString')
const {SendEmail} =require('../utils/sendEmail')
const {bufferToDataURI}=require('../utils/turnBuffertoDataURI')
const {uploadToCloudinary}=require('../utils/uploadImg')
const {roles}=require('../types/roles')
const {technical}=require('../models/TechnicalModel')
module.exports={
    signup:async(req,res)=>{
        const {name,email,password,role,country,governorate,city,age,number}=req.body;
        try{
            const exists=await user.findOne({email})
            if(exists){
             console.log('user already exists')
             throw new BadReqErr('Email is already in use')
            }
            else{
                 let img=[];
                 if(req.files){
                     if(req.files.img.length===undefined){
                         img=[req.files.img];
                     }else{
                         img=[...req.files.img];
                     }
                 }
             
                const uniqueString=GetRandString()
              
          
               const User= await user.create({name,email,password:hashPass(password),uniqueString,role,country,governorate,city,age,number})
             
               for(let i=0;i<img.length;i++){
                 let item=img[i]
                 const fileFormat = item.mimetype.split('/')[1]
                 const { base64 } = bufferToDataURI(fileFormat, item.data)
                 const imageDetails = await uploadToCloudinary(base64, fileFormat)
                 console.log(imageDetails)
                 User.imgPath.push(imageDetails.url)
                 await User.save()
             }
            
               SendEmail(User.email,User.uniqueString)
               return res.status(201).send({name:User.name,email:User.email,img:User.imgPath,role:User.role,id:User._id,country:User.country,city:User.city,governorate:User.governorate,age:User.age,number:User.number,status:true})
            } 
        }catch(err){
            throw new BadReqErr(err.message)
        }
     
    },
    signin:async(req,res)=>{
        
    const {email,password}=req.body;
    //if user exist

    const existingUser=await user.findOne({email})
    if(!existingUser){
        throw new BadReqErr('invalid creds can not find user ')
    }

    //check password
    const validate=comparePass(password,existingUser.password)
    if(!validate){
        throw new BadReqErr('invalid creds  error in password')
    }

    //check if verified or not
    if(!existingUser.IsValid){
        throw new BadReqErr('please verify your email')
    }

    //send jwt 
    const token= jwt.sign({
        id:existingUser._id,
    },process.env.JWT_KEY)
    req.session={
        jwt:token
    }
    console.log(existingUser)
    //send data
    res.status(200).send({
        name:existingUser.name,
        email:existingUser.email,
        status:true,
        id:existingUser._id,
        role:existingUser.role,
        country:existingUser.country,
        city:existingUser.city,
        governorate:existingUser.governorate,
        age:existingUser.age,
        number:existingUser.number,
        token
    })
    },
    signout:async(req,res)=>{
        req.session=null
        res.send({
            token:null,
            currentUser:null,
        })
    },
    current:async(req,res)=>{
        //check first is the session object exist and then check jwt
        if(req.currentUser){
          try{
            const data= await user.findById(req.currentUser.id).select('-password -createdAt -updatedAt -__v -uniqueResetPassStr -uniqueString -IsValid')
            if(data&&data.role===roles.Technical){
              const techData= await technical.findOne({technicalId:data._id}).select('-createdAt -updatedAt -__v')
              if(techData){
                return res.status(200).send({...data.toObject(),...techData.toObject(),status:true})
              }
            }
            return res.status(200).send({...data.toObject(),status:true})
          }catch(err){
            throw new notfound('this user can not be found')
          }
         
        }
        return res.send({currentUser:null})
    },
    update_user:async(req,res)=>{
        if(req.currentUser){
            const {name,password}=req.body
          
            try{
               const User= await user.findById(req.currentUser.id)
               User.name=name?name:User.name;
               User.password=password?hashPass(password):User.password;
             
               await User.save()
               
               return res.status(200).send({name:User.name,email:User.email,status:true})
            }catch(err){
               throw new notfound('this user can not be found')
            }
        }else{
            return res.send({currentUser:null})
        }
       
    },
    verfiyUser:async(req,res)=>{
        const {uniqueString}=req.body;
        try{
            const User=await user.findOne({uniqueString})
    
            if(User){
                User.IsValid=true;
                await User.save()
                res.send({msg:'Done Verifying',status:true})
            }
            else{
                throw new notfound('can not find the user')
            }
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    editProfileImg:async(req,res)=>{
        const id=req.currentUser.id;
        if(!id){
            throw new BadReqErr('there is no user id')
        }
        try{
            const User= await user.findById(id)
            if(!User){
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
                User.imgPath.push(imageDetails.url)
                await User.save()
             }
             return res.status(200).send({status:true,images:User.imgPath})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    resendOtp:async(req,res)=>{
        const {email}=req.body;
        try{
            const exists=await user.findOne({email})
            if(!exists){
               throw new BadReqErr('Email Not found')
            }
            const uniqueString=GetRandString()
            exists.uniqueString=uniqueString;
            await exists.save()
           
            SendEmail(exists.email,exists.uniqueString);
    
            return res.status(200).send({msg:'Otp sent Successfully.'})
           }catch(err){
            throw new BadReqErr(err.message)
           }
    },
    forgotPassword:async(req,res)=>{
        const {email}=req.body;
        
        const existingUser=await user.findOne({email})
        if(!existingUser){
            throw new BadReqErr('Can Not Find This Email.')
        }

        const otp=GetRandString()

        existingUser.set({uniqueResetPassStr:otp})

        await existingUser.save()

        SendEmail(email,otp)

        return res.status(200).send({msg:'OTP sent to your email for reseting your password please check it out.',status:true})

    },
    resetPassword:async(req,res)=>{
        const {email,uniqueString,newpass}=req.body;
        const existingUser=await user.findOne({email})
        if(!existingUser){
            throw new BadReqErr('Can Not Find This Email.')
        }

        if(existingUser.uniqueResetPassStr!==uniqueString){
            throw new BadReqErr('Bad Creds Please check your gmail for the OTP')
        }
        existingUser.set({password:hashPass(newpass)})
        await existingUser.save()
        return res.status(200).send({msg:'Success Now reset your password',status:true})
    },
    resendOtpReset:async(req,res)=>{
        const {email}=req.body;
        try{
            const exists=await user.findOne({email})
            if(!exists){
               throw new BadReqErr('Email Not found')
            }
            const uniqueResetPassStr=GetRandString()
            exists.uniqueResetPassStr=uniqueResetPassStr;
            await exists.save()
           
            SendEmail(exists.email,exists.uniqueResetPassStr);
    
            return res.status(200).send({msg:'Otp sent Successfully.'})
           }catch(err){
            throw new BadReqErr(err.message)
        }
    },
}