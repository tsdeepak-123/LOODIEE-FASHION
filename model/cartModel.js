const mongoose=require('mongoose')


const cartSchema=mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Userdata'
       
    },
   
    products: [
       {
        productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'productdatas'
        },
       quantity: {
           type: Number,
           
            },
            price: {
                type: Number,
                default:0
           }
      
        }
       
],

outofstock:{
    type:Boolean,
    default:true
}

}) 


module.exports=mongoose.model('cart',cartSchema)

