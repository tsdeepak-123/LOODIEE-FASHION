const express=require('express')
const adminRoute=express()
const adminController=require('../controller/adminController')
const multer=require('multer')
const path=require('path')
const categoryController=require('../controller/categoryController')
const productController=require('../controller/productController')
const userController=require('../controller/userController')
const session=require('../middlewares/session')
const bannerController=require('../controller/bannerController')
const orderController=require('../controller/orderController')
const couponController=require('../controller/couponController')
const nocache=require('nocache')

//---------------------------------multer middleware--------------------------------------------------------------------

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,'../public/uploads'))
    },
    filename:(req,file,cb)=>{
        const name=Date.now()+'-'+file.originalname
        cb(null,name)
    }
})

const upload=multer({
    storage:storage
})

//------------------------------------------------admin section---------------------------------------------------------

adminRoute.get('/',nocache(),session.adminNotLoggedIn,adminController.getLogin)
adminRoute.get('/adminhome',session.adminSession,adminController.getAdminhome)
adminRoute.post('/adminlogin',adminController.postLogin)
adminRoute.get('/signout',adminController.Signout)

//---------------------------------------user management-----------------------------------------------------------------
adminRoute.get('/userdisplay',session.adminSession,userController.getUserdisplay)
adminRoute.get('/adduser',session.adminSession,userController.getAdduser)
adminRoute.post('/adduserSubmit',session.adminSession,userController.postAdduser)
adminRoute.get('/edituser',session.adminSession,userController.geteditUser)
adminRoute.post('/postedituser',session.adminSession,userController.posteditUser)
adminRoute.get('/blockuser/:id',session.adminSession,userController.userBlock)
adminRoute.get('/unblockuser/:id',session.adminSession,userController.userUnblock)

//---------------------------------------category management-------------------------------------------------------------
adminRoute.get('/addcategory',session.adminSession,categoryController.getaddCategory)
adminRoute.get('/viewcategory',session.adminSession,categoryController.getcategoryDisplay)
adminRoute.post('/addcategorySubmit',session.adminSession,categoryController.postaddCategory)
adminRoute.get('/editcategory',session.adminSession,categoryController.geteditCategory)
adminRoute.post('/posteditcategory',session.adminSession,categoryController.editCategory)
adminRoute.get('/listcategory/:id',session.adminSession,categoryController.categoryList)
adminRoute.get('/unlistcategory/:id',session.adminSession,categoryController.categoryUnlist)

  
//---------------------------------------product management--------------------------------------------------------------
adminRoute.get('/addproduct',session.adminSession,productController.getaddProduct)
adminRoute.get('/viewproduct',session.adminSession,productController.adminProductdisplay)
adminRoute.post('/postaddproduct',session.adminSession,upload.array('file',4),productController.postaddProduct)
// adminRoute.get('/deleteproduct',productController.deleteProduct)
adminRoute.get('/editproduct/:id',session.adminSession,productController.geteditProduct)
adminRoute.post('/posteditproduct',session.adminSession,upload.array('file',4),productController.posteditProduct)
adminRoute.get('/listproduct/:id',session.adminSession,productController.productList)
adminRoute.get('/unlistproduct/:id',session.adminSession,productController.productUnlist)
adminRoute.get('/deletesingleimage',productController.deleteProductImage)


//-------------------------------------Banner Management------------------------------------------------------------------

adminRoute.get('/addbanner',session.adminSession,bannerController.getaddBanner)
adminRoute.post('/postaddbanner',session.adminSession,upload.single('file'),bannerController.postaddBanner)
adminRoute.get('/viewbanner',session.adminSession,bannerController.viewBanner)
adminRoute.get('/listbanner/:id',session.adminSession,bannerController.bannerList)
adminRoute.get('/unlistbanner/:id',session.adminSession,bannerController.bannerUnlist)


//-------------------------------------Order Management------------------------------------------------------------------

adminRoute.get('/vieworder',session.adminSession,orderController.orderAdmin)
adminRoute.get('/adminorderview',session.adminSession,orderController.adminOrderShow)
adminRoute.get('/admincancelorder',session.adminSession,orderController.adminorderCancel)
adminRoute.get('/shiporder',session.adminSession,orderController.shipOrder)
adminRoute.get('/orderdelivery',session.adminSession,orderController.orderDelivered)

//-------------------------------------Coupon Management--------------------------------

adminRoute.get('/addcoupon',couponController.getAddcoupon)
adminRoute.post('/postaddcoupon',couponController.addCoupon)
adminRoute.get('/viewcoupon',couponController.viewCoupon)
adminRoute.get('/listcoupon/:id',couponController.couponList)
adminRoute.get('/unlistcoupon/:id',couponController.couponUnlist)








module.exports=adminRoute