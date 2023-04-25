const wishlist=require('../model/wishlistModel')
const product=require('../model/productModel')
const category=require('../model/categoryModel')


const getWishList=async(req,res)=>{
    try{
        const usersId=req.session.user.id;
        const userName=req.session.user.username
    
        wishlistdata=await wishlist.findOne({userId:usersId}).populate("products.productId").lean()
        if(wishlistdata){
            if(!wishlistdata.products[0]){
                res.render('user/emptywishlist',{user:true,userName})
            }
            const stocks=await Promise.all(wishlistdata.products.map(async(i)=>{
                stock=await product.findOne({_id:i.productId._id}).lean()
                return stock
            }))
             res.render("user/wishlist",{user:true,stocks,userName})
        }else{
            res.render('user/emptywishlist',{user:true,userName})
        }
        
    }
    catch(error){
        console.log(error.message);
    }
}




///add to wishlist

const addToWishlist=async(req,res)=>{
    try{
       const userid=req.session?.user?.id
       const wishlistData=await wishlist.findOne({userId:userid}).lean()
       if(wishlistData){
        const productfound=await wishlist.findOne({userId:userid, "products.productId": req.query.id}).lean()
        console.log(productfound)
        if(productfound){
            await wishlist.updateOne({userId:userid},{$pull:{products:{productId:req.query.id}}})
            console.log('removed')
            res.json({status:false})
        }else{
            await wishlist.findOneAndUpdate({userId:userid},{$addToSet:{products:{productId:req.query.id}}})
            console.log('added')
            res.json({status:true})
        }
       }else{
        await wishlist.create({userId:userid,products:{productId:req.query.id}})
        console.log('created')
        res.json({status:true})
       }

    }catch(error){
        console.log(error);
    }
}

 
const deletewishlist=async(req,res)=>{
    try{
        userid=req.session.user.id
        await wishlist.updateOne({userId:userid},{$pull:{products:{productId:req.query.id}}}).lean()
        res.redirect('wishlist')
    }catch(error){
        console.log(error);
    }
}


//wishlist data displaying




module.exports={
    getWishList,
    addToWishlist,
    deletewishlist
}