const mongoose=require('mongoose')


const bannerSchema=new mongoose.Schema({
    bannerName:{
        type:String,
        require:true
    },
    bannerSubName:{
        type:String,
        require:true
    },
    bannerDiscription:{
        type:String,
        require:true
    },
    bannerImage:{
        type:Array,
        require:true
    },
    bannerPrice:{
        type:Number,

    },
    is_listed:{
        type:Boolean,
        require:true
    }
})


module.exports=new mongoose.model("bannerdata",bannerSchema)