const mongoose=require('mongoose')


const wishlistShema=mongoose.Schema({
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
        }
    ]
},
{
    timestamps:true
}
)



module.exports=mongoose.model('wishlist', wishlistShema)