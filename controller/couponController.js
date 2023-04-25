const coupon = require("../model/couponModel");
const user = require("../model/userModel");
const cart = require("../model/cartModel");

//add coupon

const addCoupon = async (req, res) => {
  try {
    const {
      couponname,
      discountamount,
      minamount,
      expirydate,
      couponcode,
      couponlimit,
    } = req.body;

    await coupon.insertMany({
      couponName: couponname,
      discountAmount: discountamount,
      minAmount: minamount,
      expiryDate: expirydate,
      couponCode: couponcode,
      couponLimit: couponlimit,
    });

    res.redirect("viewcoupon");
  } catch (error) {
    console.log(error);
  }
};

//get add coupon

const getAddcoupon = async (req, res) => {
  try {
    res.render("admin/addcoupon", { admin: true });
  } catch (error) {
    console.log(error);
  }
};

//view coupon

const viewCoupon = async (req, res) => {
  try {
    const allCouponData = await coupon.find().lean();
    res.render("admin/viewcoupon", { admin: true, allCouponData });
  } catch (error) {
    console.log(error);
  }
};


const applycoupon = async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    cartList = req.session.products;
    totalAmount = req.session.gtotal;

    couponExist = await coupon
      .findOne({ couponCode: req.body.couponId, "users.userId": userId })
      .lean();
    console.log(req.body.couponId);
    const coupons = await coupon
      .findOne({ couponCode: req.body.couponId })
      .lean();

    currentDate = new Date();

    if (coupons && coupons.couponLimit > 0) {
      if (couponExist) {
         res.json({ message: "coupon already Used" });
      }
      if (currentDate > coupons.expiryDate) {
         res.json({ message: " coupon Expired" });
      }

      if (totalAmount < coupons.minAmount) {
         res.json({
          message:
            "your total bill is under the minimum amount please purchase more",
        });
      }

      req.session.couponCode = coupons.couponCode;
      updatedTotal = totalAmount - coupons.discountAmount;

      discountAmount = coupons.discountAmount;
      updatedTotal = totalAmount - coupons.discountAmount;

      // const cartList = await cart.findOne({ userId: userId });
      req.session.updatedTotal = updatedTotal;
      req.session.discountAmount = discountAmount;
    
       res.json({
        message: "success",
        updatedTotal,
        discountAmount,
        totalAmount,
      });
    } else {
       res.json({ message: "coupon Invalid or coupon limit reached" });
    }
  } catch (error) {
    console.log(error.message);
  }
}



//unlist category


const couponUnlist = async (req, res) => {
  try {
    const id = req.params.id
    
    coupon.updateOne({ _id: id }, { $set: { is_listed: false } }).then(()=>{
      return res.json({messege:"success"})  
    })
    
  } catch (error) {
    console.log(error)
  } 
}


//list category 



const couponList= async (req, res) => {
   try {  
         const id = req.params.id
   await coupon.updateOne({_id:id}, {$set:{is_listed :true }});
   return res.json({messege:"success"})
   } catch (error) {
    console.log(error) 
   }
 
   
}

module.exports = {
  addCoupon,
  getAddcoupon,
  viewCoupon,
  applycoupon,
  couponList,
  couponUnlist
};
