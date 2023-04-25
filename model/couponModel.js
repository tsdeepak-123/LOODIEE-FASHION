const mongoose = require("mongoose");
const couponSchema = new mongoose.Schema({  
    couponName: {
        type: String,
    },
    discountAmount: {
        type: Number,
        
    },
    minAmount: {
        type:Number,
    },
    expiryDate: {
        type:Date,
    },
    couponCode: {
        type:String,
    },
    couponLimit: {
        type:Number,
    },
    users: [{
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Userdata'
          },
          couponStatus: {
            type: String,
            default: "Valid"
          }
       }],
       is_listed:{
        type:Boolean,
        default:true
       }
      
},
{timestamps:true});




module.exports=mongoose.model('Coupondata',couponSchema)