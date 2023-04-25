const cart = require("../model/cartModel");
const product = require("../model/productModel");
const user = require("../model/userModel");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const order = require("../model/orderModel");
const razorpay = require("../controller/razorpayController");
const coupon=require('../model/couponModel')


//get checkout

const checkOut = async (req, res) => {
  try {
     const userName = req.session.user.username;
     const userid = req.session?.user?.id;
     const address = req.session.user.SelAddress;
     const Addressess = await user.findOne({ _id: userid }).lean();
     const couponData=await coupon.find().lean()
    const orderDataList = await cart
      .find({ userId: userid })
      .populate("products.productId")
      .lean();
    const [{ products }] = orderDataList;

    const orderList = products.map(({ productId, quantity, price }) => ({
      _id: productId._id,
      productname: productId.productname,
      price,
      image: productId.image,
      quantity,
      stock: productId.stock,
    }));

    const Grandtotal = orderList.reduce(
      (total, value) => total + value.price,
      0
    );

    req.session.products = orderList;
    req.session.gtotal = Grandtotal;
    res.render("user/checkoutmain", {
      user: true,
      userName,
      orderList,
      Grandtotal,
      address,
      couponData,
      Addressess 
    });
  } catch (error) {
    console.log(error);
  }
};

//Address typing whwn checkout

const postaddress = async (req, res) => {
  try {
    const userid = req.session?.user?.id;
    userName = req.session.user.username;
    const x = await user.find({ _id: userid });
    const {
      firstname,
      lastname,
      email,
      phone,
      country,
      streetaddress,
      town,
      district,
      pincode,
      state,
    } = req.body;
    await user.updateOne(
      { _id: userid },
      {
        $push: {
          address: {
            firstname: firstname,
            lastname: lastname,
            email: email,
            phone: phone,
            streetaddress: streetaddress,
            district: district,
            state: state,
            pincode: pincode,
            town: town,
            country: country,
          },
        },
      }
    );

    res.redirect("addressbook");
  } catch (error) {
    console.log(error);
  }
};

const selectaddress = async (req, res) => {
  try {
    const userid = req.session.user.id;
    const id = req.query.id;
    const addressess = await user.aggregate([
      {
        $match: { _id: new ObjectId(userid) },
      },
      {
        $unwind: "$address",
      },
      {
        $match: { "address._id": new ObjectId(id) },
      },
    ]);
    req.session.user.SelAddress = addressess[0].address;

    res.redirect("checkout");
  } catch (error) {
    console.log(error);
  }
};

const placeOrder = async (req, res) => {
  try {
    const userid = req.session.user.id;
    address = req.session.user.SelAddress;
    const products = req.session.products;
    const gtotal = req.session.gtotal;
    const payment = req.body.paymentmethode;
       const updatedTotal=req.session.updatedTotal
      const discountAmount=req.session.discountAmount
  
    userName = req.session.user.username;
    const orderdate = new Date().toLocaleString();

    const orderd = await order.insertMany({
      userId: userid,
      address: address,
      payment: payment,
      username: userName,
      products: products,
      totalprice: gtotal,
      orderdate: orderdate,
      discountAmount:discountAmount,
      grandtotal:updatedTotal
      
    });
    const orderData = await order.findOne({ _id: orderd._id }).lean();
    req.session.confirmData = orderData;
    await cart.deleteOne({ userId: userid });

    return res.json({messege:"success",
   
  });

    //  res.render('user/orderconfirmation',{user:true,address,products,gtotal,payment, userName,orderdate})
  } catch (error) {
    console.log(error);
  }
};

//initiate pay

const initiatePay = async (req, res) => {
  try {
    const userid = req.session.user.id;

    const cartList = await cart.findOne({ userId: userid }).lean();

    address = req.session.user.SelAddress;
    const products = req.session.products;
    const totalprice = req.session.gtotal
    const payment = req.body.paymentmethode;
    const grandtotal=req.session.updatedTotal
    const discountAmount=req.session.discountAmount
    
    userName = req.session.user.username;
    orderdate = new Date().toLocaleString();

    const orderData = await order.insertMany({
      userId: userid,
      address: address,
      payment: payment,
      username: userName,
      products: products,
      totalprice:totalprice, 
      orderdate: orderdate,
      discountAmount:discountAmount,
      grandtotal:updatedTotal
    });

    const razorData = await razorpay.initiateRazorpay(
      orderData._id,
      grandtotal
    );

    await order.findOneAndUpdate(
      { _id: orderData._id },
      { $set: { orderId: razorData.id } }
    );

    const confirmData = await order.findOne({ _id: orderData._id }).lean();
    req.session.orderData = confirmData;

    return res.json({ message: "success", razorData, orderData, totalAmount });
  } catch (error) {
    console.log(error.message);
  }
};

//verify payment

const verifyPayment = async (req, res, next) => {
  try {
    const userid = req.session.user.id;
    success = await razorpay.validate(req.body);
    if (success) {
      orderData = await order
        .findOneAndUpdate(
          { orderId: req.body.razorData.id },
          { paymentStatus: "success" }
        )
        .lean();

     

      await cart.findOneAndDelete({ userId: userid });

      return res.json({ status: true });
    } else {
      await order.findOneAndUpdate(
        { orderId: req.body["razorData[id]"] },
        { paymentStatus: "failed" }
      );
      return res.json({ status: false });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//oreder confirmation

const confirmOrder = async (req, res) => {
  try {
    address = req.session.user.SelAddress;
    const products = req.session.products;
    const totalprice = req.session.gtotal;
    const payment = req.body.paymentMethode;
    const grandtotal=req.session.updatedTotal
    const discountAmount=req.session.discountAmount
    userName = req.session.user.username;
    orderdate = new Date().toLocaleString();

    res.render("user/orderconfirmation", {
      user: true,
      address,
      products,
      totalprice,
      payment,
      userName,
      orderdate,
      grandtotal,
      discountAmount
    });
  } catch (error) {
    console.log(error);
  }
};

//user order display

const userOrderdisplay = async (req, res) => {
  try {
    const userid = req.session.user.id;
    const itemsPerPage = 2;
    const page = parseInt(req.query.page) || 1;
    const totalItems = await product.countDocuments();
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const orderData = await order.find({ userId: userid }).sort({ orderdate: -1 }).skip(startIndex).limit(itemsPerPage).lean();
    res.render("user/myorders", { user: true, orderData,totalPages,currentPage:true});
  } catch (error) {
    console.log(error);
  }
};

//order manage

const manageOrder = async (req, res) => {
  try {
    userid = req.session.user.id;
    const id = req.query.id;
    const orderData = await order.find({ userId: userid, _id: id }).lean();
    res.render("user/orderdetail", { user: true, orderData });
  } catch (error) {
    console.log(error);
  }
};

//view orders on admin side

const orderAdmin = async (req, res) => {
  try {
    const orderData = await order.find().lean();
    res.render("admin/vieworder", { admin: true, orderData});
  } catch (error) {
    console.log(error);
  }
};

//admin order manage

const adminOrderShow = async (req, res) => {
  try {
    const id = req.query.id;
    const orderData = await order.find({ _id: id }).lean();
    res.render("admin/orderdetail", {
      adminorderview: true,
      admin: true,
      orderData,
    });
  } catch (error) {
    console.log(error);
  }
};

//order cancel

const orderCancel = async (req, res) => {
  try {
    const orderid = req.query.id;
    await order.findByIdAndUpdate({ _id: orderid }, { is_cancelled: true });
    res.redirect("myorders");
  } catch (error) {
    console.log(error);
  }
};

//admin order cancel

const adminorderCancel = async (req, res) => {
  try {
    const orderid = req.query.id;
    await order.findByIdAndUpdate({ _id: orderid }, { is_cancelled: true });
    res.redirect("/admin/vieworder");
  } catch (error) {
    console.log(error);
  }
};

//order shiped

const shipOrder = async (req, res) => {
  try {
    const orderid = req.query.id;
    await order.findByIdAndUpdate({ _id: orderid }, { orderStatus: true });
    res.redirect("/admin/vieworder");
  } catch (error) {
    console.log(error);
  }
};

//order delivered

const orderDelivered = async (req, res) => {
  try {
    const orderid = req.query.id;
    await order.findByIdAndUpdate({ _id: orderid }, { is_delivered: true });
    await order.findByIdAndUpdate({ _id: orderid }, { orderStatus: true });
    res.redirect("/admin/vieworder");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  checkOut,
  postaddress,
  selectaddress,
  placeOrder,
  userOrderdisplay,
  manageOrder,
  orderAdmin,
  adminOrderShow,
  confirmOrder,
  initiatePay,
  verifyPayment,
  orderCancel,
  adminorderCancel,
  shipOrder,
  orderDelivered,
};
