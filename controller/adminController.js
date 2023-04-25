const admin=require('../model/adminModel')
const user=require('../model/userModel')
const bcrypt=require('bcrypt')
const order=require('../model/orderModel')
const session=require('express-session')




// admin login

const getLogin=(req,res)=>{
    try{
        res.render('admin/login',{adminlogin:true})
    }catch(error){
        console.log(error)
    }
}


//get admin home

const getAdminhome=async(req,res)=>{
    try{
        const SalesData= await order.find().lean()
        const saletotal = SalesData.reduce((total, value) => {
            if (value.is_delivered) {
              return total + value.totalprice;
            } else {
              return total;
            }
          }, 0);
          const today= new Date().toLocaleString();
        res.render('admin/adminhome',{admin:true,SalesData,saletotal,today})
    }catch(error){
        console.log(error)
    }
}





//admin post

const postLogin=async(req,res)=>{
    try{
        const {email,password}=req.body
        const admindata=await admin.findOne({email:email})
        if(admindata){
            const status=await bcrypt.compare(password,admindata.password)
            if(status){
                req.session.admin = {};
                req.session.admin.id = admindata._id  
                req.session.admin.loggedIn = true 
                res.redirect('adminhome')
            }else{
                res.render('admin/login',{messege:'Invalid Password',adminlogin:true})
            }
        }else{
            res.render('admin/login',{messege:'Invalid Email id',adminlogin:true})
        }
    }catch(error){
        console.log(error)
    }
}


//signout admin

const Signout=async(req,res)=>{
    try{
        req.session.admin = null
       res.redirect('/admin')
    }catch(error){
        console.log(error);
    }
}




module.exports={
    getLogin,
    postLogin,
    getAdminhome,
    Signout
}