const product = require("../model/productModel");
const category = require("../model/categoryModel");
const { populate } = require("../model/categoryModel");
const userController = require("../controller/userController");
const cart = require("../model/cartModel");
const banner=require('../model/bannerModel')


//view products page render

const getHome = async (req, res) => {
  try {
    userid = req.session?.user?.id;
    const userName = req.session?.user?.username;
    const allBannerData=await banner.find().lean()
    const itemsPerPage = 12;
    const page = parseInt(req.query.page) || 1;
    const totalItems = await product.countDocuments();
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    allProductsData = await product.find().populate("category").skip(startIndex).limit(itemsPerPage).lean();
    res.render("user/home", {
      user: true,
      allProductsData,
      userName,
      allBannerData,
      totalPages,
      currentPage:true
    });
  } catch{
    res.render('user/404')
  }
};

//get add product

const getaddProduct = async (req, res) => {
  try {
    const categoryData = await category.find().lean();
    if (categoryData)
      res.render("admin/addProduct", { categoryData, admin: true });
  } catch (error) {
    console.log(error);
  }
}

//post add product

const postaddProduct = async (req, res) => {
  try {
    console.log(req.body);
    const categoryData = await category.findOne({ name: req.body.category });
    const categoryId = categoryData._id;
    const { productname, brandname, discription, price, stock } = req.body;

    const file = req.files.map((file) => file.filename);
    // const productAlready=await product.findOne({productname:productname})
    // if(productAlready){
    //   res.render('admin/addProduct',{admin:true})
    // }else{
    const data = new product({
      productname: productname,
      brandname: brandname,
      category: categoryId,
      price: price,
      discription: discription,
      stock: stock,
      image: file,
    });
    const result = await data.save();
    if (result) {
      res.redirect("viewproduct");
    } else {
      res.render("admin/addProduct", { admin: true });
    }
  } catch (error) {
    console.log(error);
  }
};

//get products display

const adminProductdisplay = async (req, res) => {
  try {
    allProductData = await product.find().populate("category").lean();
    console.log(allProductData);
    if (allProductData) {
      res.render("admin/viewProducts", { allProductData, admin: true });
    }
  } catch (error) {
    console.log(error);
  }
};


//unlist product

const productUnlist = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const productDetails = await product.findById(id);
    console.log(productDetails);
    product.updateOne({ _id: id }, { $set: { is_listed: false } }).then(() => {
      return res.json({messege:"success"})
    });
  } catch (error) {
    console.log(error);
  }
};

//list product

const productList = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    await product.updateOne({ _id: id }, { $set: { is_listed: true } });
    return res.json({messege:"success"})
  } catch (error) {
    console.log(error);
  }
};

//get edit product

const geteditProduct = async (req, res) => {
  try {
    const categoryData = await category.find().lean();
   console.log(categoryData);
    const id = req.params.id;
    const productDetails = await product
      .findById({ _id: id })
      .populate("category")
      .lean();

    if (productDetails) {
      res.render("admin/editProduct", { productDetails, admin: true,categoryData});
    }
  } catch (error) {
    console.log(error);
  }
};

//post edit product


const posteditProduct = async (req, res) => {
  try {
    
    const id = req.query.id;

    const categoryData = await category.findOne({ name: req.body.category });

    let updatedFields = {
      productname: req.body.productname,
      brandname: req.body.brandname,
      price: req.body.price,
      discription: req.body.discription,
      stock: req.body.stock,
      category: categoryData._id,
    };

    // check if new image(s) were uploaded
    if (req.files && req.files.length > 0) {
      const existingProduct = await product.findById(id);
      let images = existingProduct.image;

      // append the filename of the new image(s) to the images array
      req.files.forEach((file) => {
        images.push(file.filename);
      });

      updatedFields.image = images;
    }

    await product.updateOne({ _id:id }, { $set: updatedFields });
    res.redirect('viewproduct');
  } catch (error) {
    console.log(error);
  }
};




// single image edit

const deleteProductImage=async(req,res)=>{
  const id=req.query.id
  const imageId = req.query.imageId;
  await product.updateOne({_id:id},{$pull:{image:imageId}})
    res.redirect(`/admin/editproduct/${id}`);


 
}








//show  products to user

const userProductdisplay = async (req, res) => {
  try {
    userid=req.session?.user?.id
    const categoryData = await category.find().lean();
    const userName = req.session?.user?.username;
    const itemsPerPage = 9;
    const page = parseInt(req.query.page) || 1;
    const totalItems = await product.countDocuments();
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    // const endIndex = page * itemsPerPage;
    
    allProductData = await product.find().populate("category").skip(startIndex).limit(itemsPerPage).lean();
    if (allProductData) {
      res.render("user/shop", {
        allProductData,
        user: true,
        categoryData,
        userName,
        totalPages,
        currentPage: page
        
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//single product view

const singleProductView = async (req, res) => {
  try {
     userid=req.session?.user?.id
     const userName = req.session?.user?.username; 

    const productFind = await product.findOne({ _id: req.query.id }).lean();
    console.log(productFind);
    res.render("user/buynow", {
      user: true,
      productFind,
      userName,
    });
  } catch (error) {
    console.log(error);
  }
};









module.exports = {
  getaddProduct,
  postaddProduct,
  adminProductdisplay,
  geteditProduct,
  posteditProduct,
  getHome,
  productUnlist,
  productList,
  userProductdisplay,
  singleProductView,
  deleteProductImage
 

};
