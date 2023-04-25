const user = require("../model/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const product = require("../model/productModel");
const cart = require("../model/cartModel");
const otpGen = require("../mailer");
const session=require('express-session')

//password bcrypting

const securepassword = async (password) => {
  try {
    const hashpassword = await bcrypt.hash(password, 10);
    return hashpassword;
  } catch (error) {
    console.log(error);
  }
};

//get login page

const getLogin = (req, res) => {
  try {
    res.render("user/login", { userlogin: true });
  } catch (error) {
    console.log(error);
  }
};

// signup page

const getsignup = (req, res) => {
  try {
    res.render("user/signup", { userlogin: true });
  } catch (error) {
    console.log(error);
  }
};

//sign up checking

let userData;
const postSignup = async (req, res) => {
  try {
    const { username, phone, email, password } = req.body;
    if (username && phone && email && password) {
      const alreadyExist = await user.findOne({ email: email });
      if (alreadyExist) {
        res.render("user/signup", {
          userlogin: true,
          messege: "Email Already Exists",
        });
      } else {
        const otp = otpGen.otpGen();
        req.session.user = req.body;
        req.session.user.otp = otp;

        console.log(otp);
        userData = email;
        sendVerification(username, email, otp);
        res.render("user/otp", { userlogin: true });
      }
    } else {
      res.render("user/signup", {
        userlogin: true,
        messege: "All fields required",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//otp verification

const otpVerification = async (req, res) => {
  const otp = req.body.otp;
  const genOtp = req.session.user.otp;
  console.log(genOtp);
  if (otp == genOtp) {
    const { username, email, phone, password } = req.session.user;
    const data = new user({
      username: username,
      phone: phone,
      email: email,
      password: await securepassword(password),
    });
    const result = await data.save();

    res.redirect("/");
  } else {
    res.render("user/otp", { userlogin: true, messege: "Invalid OTP" });
  }
};

//sent email for verification

const sendVerification = async (username, email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "trensdonline321@gmail.com",
        pass: "nhafzvymvldqdbbs",
      },
    });
    const mailOption = {
      from: "trendsonline321@gmail.com",
      to: email,
      subject: "for verification mail",
      html:
        "<p>Hii," +
        username +
        ",Your otp for login is <h1>" +
        otp +
        "</h1></p>",
    };
    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("email send", info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//admin adding

// const postSignup=async(req,res)=>{
//     try{

//     const{username,phone,email,password,cpassword}=req.body
//     if(email && password){
//     // const alreadyExist=await user.findOne({email:email})
//     // if(alreadyExist){
//     //     res.render('user/signup')
//     // }else{
//         const data=new admin({
//             // username:username,
//             // phone:phone,
//             email:email,
//             password:await securepassword(password),
//             // cpassword:await securepassword(cpassword)

//         })
//         const result=await data.save()
//         console.log(result)
//         if(result){
//             res.render('user/otpphone')
//         }else{
//             res.render('user/signup',{messege:'Registration failed'})
//         }
//     }
// }catch(error){
//     console.log(error)
// }
//     }

//login authentication

const postLogin = async (req, res) => {
  try {
    const { password, email } = req.body;
    const newuser = await user.findOne({ email: email });

    if (newuser) {
      const status = await bcrypt.compare(password, newuser.password);

      if (status) {
        req.session.user = {};
        req.session.user.id = newuser._id;
        req.session.user.username = newuser.username;
        req.session.user.loggedIn = true;
        res.redirect("/");
      } else {
        res.render("user/login", {
          userlogin: true,
          messege: "Password incorrect",
        });
      }
    } else {
      res.render("user/login", {
        userlogin: true,
        messege: "Invalid Email id",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//get add user

const getAdduser = (req, res) => {
  try {
    res.render("admin/addUser", { admin: true });
  } catch (error) {
    console.log(error);
  }
};

//add user

const postAdduser = async (req, res) => {
  try {
    const { username, phone, email, password, cpassword } = req.body;
    if (username && phone && email && password && cpassword) {
      const alreadyExist = await user.findOne({ email: email });
      if (alreadyExist) {
        res.render("admin/addUser", { admin: true });
      } else {
        const data = new user({
          username: username,
          phone: phone,
          email: email,
          password: await securepassword(password),
          cpassword: await securepassword(cpassword),
        });
        const result = await data.save();
        console.log(result);
        if (result) {
          res.redirect("userdisplay");
        } else {
          res.render("admin/addUser", { admin: true });
        }
      }
    } else {
      res.render("admin/addUser", { admin: true });
    }
  } catch (error) {
    console.log(error);
  }
};

//userdisplay

const getUserdisplay = async (req, res) => {
  try {
    allUserData = await user.find().lean();
    console.log(allUserData);
    if (allUserData) {
      res.render("admin/usermanagement", { allUserData, admin: true });
    }
  } catch (error) {
    console.log(error);
  }
};

//get edit user

const geteditUser = async (req, res) => {
  try {
    const id = req.query.id;
    const userDetails = await user.findById({ _id: id }).lean();
    if (userDetails) {
      console.log(userDetails);
      res.render("admin/editUser", { userDetails, admin: true });
    }
  } catch (error) {
    console.log(error);
  }
};

//post edit user

const posteditUser = async (req, res) => {
  try {
    const id = req.query.id;
    const { username, phone, email } = req.body;
    await user
      .findByIdAndUpdate(
        { _id: id },
        { $set: { username: username, phone: phone, email: email } }
      )
      .lean();
    res.redirect("userdisplay");
  } catch (error) {
    console.log(error);
  }
};

//block user

const userBlock = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const userDetails = await user.findById(id);
    console.log(userDetails);
    user.updateOne({ _id: id }, { $set: { block: true } }).then(() => {
      //   res.redirect("/admin/userdisplay");
      return res.json({ messege: "success" });
    });
  } catch (error) {
    console.log(error);
  }
};

//unblock user

const userUnblock = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    await user.updateOne({ _id: id }, { $set: { block: false } });
    //  res.redirect('/admin/userdisplay')
    return res.json({ messege: "success" });
  } catch (error) {
    console.log(error);
  }
};

const signOut = (req, res) => {
  try {
    req.session.user = null;
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

//user profile

const myProfile = async (req, res) => {
  try {
    userid = req.session.user.id;
    userName = req.session.user.username;
    const allUserData = await user.findOne({ _id: userid }).lean();
    console.log(allUserData);
    res.render("user/userprofile", { user: true, allUserData, userName });
  } catch (error) {
    console.log(error);
  }
};

//user edit profile

const getEditprofile = async (req, res) => {
  try {
    userid = req.session.user.id;
    const userName = req.session?.user?.username;
    const userData = await user.findOne({ _id: userid }).lean();
    res.render("user/editprofile", { user: true, userData, userName });
  } catch (error) {
    console.log(error);
  }
};

//get address book

const getAddressbook = async (req, res) => {
  try {
    userid = req.session.user.id;
    const userName = req.session.user.username;
    const Addressess = await user.findOne({ _id: userid }).lean();
    
    res.render("user/addressbook", {
      user: true,
      userName,
      userprofile: true,
      Addressess,
    });
  } catch (error) {
    console.log(error);
  }
};

const getAddAddress = (req, res) => {
  try {
    userName = req.session.user.username;
    res.render("user/addaddress", { user: true, userName });
  } catch (error) {
    console.log(error);
  }
};

//resend otp
const resendOtp = (req, res) => {
  otp = otpGen.otpGen();
  sendVerification(userData, otp);
  res.render("user/otp", { userlogin: true });
};

//Add user address

// const addUserAddress=async(req,res,next)=>{
//     try{
//         let userId=req.session.user.id
//     let addressData=req.body
//         let address={
//             name:addressData.fname+' '+addressData.lname,
//             address:addressData.address,
//             town:addressData.town,
//             pincode:addressData.pincode,
//             state:addressData.state,
//             phone:addressData.phone,
//             email:addressData.email,
//             index:count
//         }
//         user.updateOne({_id:userId},{$push:{address:address}})
//         res.redirect('')
//     }
//     catch(err){
//         next(err)
//     }
// }

//exporting

module.exports = {
  getLogin,
  postSignup,
  postLogin,
  getsignup,
  getUserdisplay,
  getAdduser,
  postAdduser,
  geteditUser,
  posteditUser,
  userBlock,
  userUnblock,
  signOut,
  myProfile,
  // myOrders,
  getEditprofile,
  getAddressbook,
  otpVerification,
  getAddAddress,
  resendOtp,
};
