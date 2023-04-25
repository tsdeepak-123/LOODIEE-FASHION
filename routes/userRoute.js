const express=require('express')
const userRoute=express()
const userController=require('../controller/userController')
const categoryController=require('../controller/categoryController')
const productController=require('../controller/productController')
const wishlistContrller=require('../controller/wishlistController')
const cartController=require('../controller/cartController')
const orderController=require('../controller/orderController')
const session=require('../middlewares/session')
const nocache=require('nocache')
const razorpayController = require('../controller/razorpayController')
const couponController=require('../controller/couponController')



//----------------------------User system-----------------------------------------------------------


userRoute.get('/login',session.sessionNotLoggedIn,userController.getLogin)
userRoute.get('/signup',userController.getsignup)
userRoute.get('/signin',userController.getLogin)
userRoute.post('/signupsubmit',userController.postSignup)
userRoute.post('/loginsubmit',userController.postLogin)
// userRoute.get('/verify',userController.mailVerify)
userRoute.get('/signout',userController.signOut)
userRoute.get('/geteditprofile',session.sessionCheck,userController.getEditprofile)
userRoute.post('/otpsubmit',userController.otpVerification)
userRoute.get('/resendOtp',userController.resendOtp)



//-----------------------------product----------------------------------------------------------------------


userRoute.get('/',nocache(),productController.getHome)
userRoute.get('/shop',productController.userProductdisplay)
userRoute.get('/productview',productController.singleProductView)
// userRoute.get('/checkout',session.sessionCheck,userController.checkOut)



//-----------------------------------User management-------------------------------------------------------------------

userRoute.get('/myprofile',session.sessionCheck,userController.myProfile)
userRoute.get('/addressbook',session.sessionCheck,userController.getAddressbook)
userRoute.get('/add-address',session.sessionCheck,userController.getAddAddress)
userRoute.get('/myorders',session.sessionCheck,orderController.userOrderdisplay)







//---------------------------------------Wishlist-----------------------------------------------------------------------

userRoute.get('/postwishlist',session.sessionCheck,wishlistContrller.addToWishlist)
userRoute.get('/wishlist',session.sessionCheck,wishlistContrller.getWishList)
userRoute.get('/deletewishlist',session.sessionCheck,wishlistContrller.deletewishlist)




//-----------------------------------------cart controller------------------------------------------------------------------


userRoute.get('/addtocart',session.sessionCheck,cartController.addToCart)
userRoute.get('/displaycart',session.sessionCheck,cartController.getCart)
userRoute.get('/deletecart',session.sessionCheck,cartController.cartDelete)
userRoute.put('/cart/update/:id',cartController.updateCart)




//----------------------------------------------------FILTERS-----------------------------------------------------------------

userRoute.get('/filter',categoryController.categoryFilter)




//----------------------------------------------------Order-----------------------------------------------------------------

userRoute.get('/checkout',session.sessionCheck,orderController.checkOut)
userRoute.post('/add-address',orderController.postaddress)
userRoute.get('/select',session.sessionCheck,orderController.selectaddress)
userRoute.post('/placeorder',session.sessionCheck,orderController.placeOrder)
userRoute.get('/vieworder',session.sessionCheck,orderController.manageOrder)
userRoute.get('/confirm',session.sessionCheck,orderController.confirmOrder)
userRoute.post('/initiateRazorpay',orderController.initiatePay)
userRoute.post('/verifyPayment',session.sessionCheck,orderController.verifyPayment)
userRoute.get('/cancelorder',session.sessionCheck,orderController.orderCancel)



//------------------------------------------Coupon------------------------------------------------------------------------------

userRoute.post('/applycoupon',couponController.applycoupon)



//--------------------------------------------sorting---------------------------------------









module.exports=userRoute