const mongoose=require('mongoose')


const userSchema= mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
    },
    block:{
        type:Boolean,
        default:false
    },
    is_verified:{
        type:Number,
        default:0
    },
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
      }],
      address:[{
        firstname:{
            type:String    
        },
        lastname:{
            type:String    
        },
        email:{
            type:String    
        },
        phone:{
            type:String    
        },
        streetaddress:{
            type:String    
        },
        district:{
            type:String    
        },
        state:{
            type:String    
        },
        pincode:{
            type:Number    
        },
        town:{
            type:String    
        },
        country:{
            type:String    
        },
      }],
      usedCoupon:{
        type:String
      }


})

module.exports=mongoose.model('Userdata',userSchema)