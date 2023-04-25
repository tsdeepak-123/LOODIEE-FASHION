
const category=require('../model/categoryModel')
const product=require('../model/productModel')






//get Add category

const getaddCategory=(req,res)=>{
    try{
      res.render('admin/addCategory',{admin:true})
    }catch(error){
        console.log(error);
    }
}




//post add category

const postaddCategory=async(req,res)=>{
    try{
      const name=req.body.name
      const categoryAlready=await category.findOne({name:name})
      if(categoryAlready){
        res.render('admin/addCategory',{admin:true,messege:'Category already exists'})
      }else{
        const data=new category({
            name:name
        })
        const result=await data.save()
        if(result){
            res.redirect('viewcategory')
        }else{
            res.render('admin/addCategory',{admin:true})
        }
      }
    }catch(error){
        console.log(error);
    }
}
 





//category display

const getcategoryDisplay=async(req,res)=>{
    try{
        const allCategory=await category.find().lean()
        if(allCategory){
           res.render('admin/viewCategory',{admin:true,allCategory,category:true})
        }
    }catch(error){
        console.log(error)
    }
}





//delete category

// const deleteCategory=async(req,res)=>{
//     try{
//         const id=req.query.id
//         await category.deleteOne({_id:id})
//         res.redirect('viewcategory')


//     }catch(error){
//         console.log(error);
//     }
// }




//get edit category

const geteditCategory=async(req,res)=>{
    try{
        const id=req.query.id
        const categoryData=await category.findById({_id:id}).lean()
        console.log(categoryData);
        if(categoryData){
        res.render('admin/editCategory',{categoryData,admin:true})
        }
    }catch(error){
        console.log(error)
    }
}




//post edit category

const editCategory=async(req,res)=>{
    try{
        const name=req.body.name
        const id=req.query.id
         const alreadyExist=await category.exists({ name: name, _id: { $ne: id } }).lean()
         const categoryData=await category.findById({_id:id}).lean()
        if(alreadyExist){
          // res.redirect('editcategory?id='+id)
          res.render('admin/editCategory',{admin:true,messege:'Category already exists',categoryData})
        }else{
            await category.findByIdAndUpdate({_id:id},{$set:{name:name}})
            res.redirect('viewcategory')
        }
    }catch(error){
        console.log(error);
    }
}


//unlist category


const categoryUnlist = async (req, res) => {
    try {
      const id = req.params.id
      const categoryDetails = await category.findById(id);
      console.log(categoryDetails);
      category.updateOne({ _id: id }, { $set: { is_listed: false } }).then(()=>{
        return res.json({messege:"success"})  
      })
      
    } catch (error) {
      console.log(error)
    } 
  }
  
  
  //list category 
  
  
  
  const categoryList= async (req, res) => {
     try {  
           const id = req.params.id
     await category.updateOne({_id:id}, {$set:{is_listed :true }});
     return res.json({messege:"success"})
     } catch (error) {
      console.log(error) 
     }
   
     
  }


//category filter for user


  const categoryFilter= async function (req,res){ 
    try{
      userid=req.session?.user?.id
      
    const categoryData=await category.find().lean() 
    const categoryid=req.query.id
    const userName=req.session?.user?.username
    const itemsPerPage = 9;
    const page = parseInt(req.query.page) || 1;
    const totalItems = await product.countDocuments();
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    // const endIndex = page * itemsPerPage;
    
    allProductData = await product.find({category:categoryid}).populate("category").skip(startIndex).limit(itemsPerPage).lean();
    if (categoryData) {
      res.render("user/shop", {
        allProductData,
        user: true,
        categoryData,
        userName,
        totalPages,
        currentPage: page
        
      });
    }
       else{
      res.redirect("shop")
     } 
  }catch(error){
    console.log(error)
  }
}








module.exports={
    getaddCategory,
    postaddCategory,
    getcategoryDisplay,
    // deleteCategory,
    geteditCategory,
    editCategory,
    categoryUnlist,
    categoryList,
    categoryFilter,
   
}