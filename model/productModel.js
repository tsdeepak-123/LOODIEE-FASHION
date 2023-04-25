const mongoose=require('mongoose')


const productSchema=mongoose.Schema({
   productname:{
    type:String,
    required:true
   },
   brandname:{
    type:String,
    required:true
   },
   category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"category",
    required:true
   },
   price:{
    type:Number,
    required:true
   },
   image:{
    type:Array,
    required:true
   },
   stock:{
    type:Number,
    required:true
   },
   discription:{
      type:String,
    required:true
   },
   is_listed:{
      type:Boolean,
      default:true
   },
   
},
{
timestamps:true}
)


module.exports=mongoose.model('productdatas',productSchema) 