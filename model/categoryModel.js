const mongoose=require('mongoose')


const userSchema= mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    is_listed:{
        type:Boolean,
        default:true
    },
    
})

module.exports=mongoose.model('category',userSchema)