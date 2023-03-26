const mongoose=require('mongoose')
const {roles}=require('../types/roles')
const TechnicalSchema=mongoose.Schema({
    job:{
        type:String,
        required:true,
    },
    experience:{
        type:String,
        required:true,
    },
    gender:{
        type:String,
        enum:Object.values({male:'male',female:'female'}),
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    rangeJob:{
        type:String,
        enum:Object.values({inside:'inside',outside:'outside'}),
        required:true,
    },
    jobKind:{
        type:String,
        enum:Object.values({hour:'hour',day:'day'}),
        required:true,
    },
    certificate_img:{
        type:[String],
    },
    technicalId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},
{ timestamps: true })
module.exports={technical:mongoose.model('Technical',TechnicalSchema)}