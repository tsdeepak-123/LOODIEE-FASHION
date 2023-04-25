const session=require('express-session')





const sessionCheck=(req,res,next)=>{
    if(req.session.user==null){
        res.redirect('login')
    }else{
        next()
    }
}



const adminSession=(req,res,next)=>{
    if(req.session.admin==null){
        res.redirect('/admin')
    }else{
        next()
    }
}



const  sessionNotLoggedIn=(req,res,next)=>{
    if(req.session.user && req.session.user.loggedIn){
        res.redirect('/')
    }else{
        next()
    }
}


const  adminNotLoggedIn=(req,res,next)=>{
    if(req.session.admin && req.session.admin.loggedIn){
        res.redirect('/adminhome')
    }else{
        next()
    }
}















module.exports={sessionCheck,adminSession,sessionNotLoggedIn,adminNotLoggedIn}