const mongoose=require('mongoose')

const orderSchema=mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userdata'
    },
    username:{
        type:String
    },
    products: {
  type:Array
    },
    address:{
        type:Array
    },
    totalprice:{
        type:Number
    },
    orderdate:{
        type: String,
        required:false,
    },
    is_cancelled:{
        type: Boolean,
        default:false
        
    },
    orderStatus:{
        type: Boolean,
        default:false
        
    },
    is_delivered:{
        type:Boolean,
        default:false
    },
    payment:{
        type:String,
        
    },
    paymentStatus:{
        type:String,
        default:"success"
    },
    discountAmount:{
        type:Number
    },
    grandtotal:{
      type:Number
    }


})
module.exports=mongoose.model('orderdata',orderSchema)