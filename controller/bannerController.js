const banner=require('../model/bannerModel')




//get Add banner

const getaddBanner =(req, res) => {
    try {
        res.render("admin/addbanner", {admin: true });
    } catch (error) {
      console.log(error);
    }
  }

//post add banner

  const postaddBanner = async (req, res) => {
    try {
      console.log(req.body)
      
      const { bannerName, bannerSubName, bannerDiscription, bannerPrice} = req.body;
  
      const file = req.file.filename;
      const data = new banner({
        bannerName: bannerName,
        bannerSubName: bannerSubName,
        bannerDiscription: bannerDiscription,
        bannerPrice: bannerPrice,
        bannerImage: file,
      });
      const result = await data.save();
      if (result) {
        res.redirect("viewbanner");
      } else {
        res.render("admin/addbanner", { admin: true });
      }
    } catch (error) {
      console.log(error);
    }
  };
  



//view banner on user side


const viewBanner=async(req,res)=>{
    try{
  const allBannerData=await banner.find().lean()
      res.render('admin/viewbanner',{admin:true,allBannerData})
    }catch(error){
        console.log(error)
    }
}


//list banner

const bannerList = async (req, res) => {
  try {
    const id = req.params.id;
    
    await banner.updateOne({ _id: id }, { $set: { is_listed: true } });
    return res.json({messege:"success"})
  } catch (error) {
    console.log(error);
  }
}


//unlist banner

const bannerUnlist = async (req, res) => {
  try {
    const id = req.params.id;
    const bannerDetails = await banner.findById(id);
    banner.updateOne({ _id: id }, { $set: { is_listed: false } }).then(() => {
      return res.json({messege:"success"})
    });
  } catch (error) {
    console.log(error);
  }
};










module.exports={getaddBanner,postaddBanner,viewBanner,bannerUnlist,bannerList}

