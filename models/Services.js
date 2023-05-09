const mongoose=require('mongoose')
const ServicesSchema=mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    technicalId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    price:{
        type:Number,
        required:true,
    },
    ratings:{
        rateByUser:[{
          userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          stars: { type: Number, required: true, min: 1, max: 5 }
        }],
        avgRating:{
          type:Number,
          default:0
        },
        count:{
          type:Number,
          default:0
        }
    }
},
{ timestamps: true })
module.exports={services:mongoose.model('Service',ServicesSchema)}