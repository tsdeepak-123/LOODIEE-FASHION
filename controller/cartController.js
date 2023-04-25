
const cart = require("../model/cartModel");
const product = require("../model/productModel");


//add to cart

const addToCart = async (req, res, next) => {
  try {
    const productid = req.query.id;
    const userid = req.session?.user?.id;
    const cartproduct = await cart.findOne({ userId: userid }).lean();

    const stock = await product.findOne({ _id: productid }).lean();

    let price = stock.price;
    if (stock.stock <= 0)
       res.json({ message: "sorry product is out of stock" });
    if (cartproduct) {
      const productexist = await cart.findOne({
        userId: userid,
        "products.productId": productid,
      });
      if (productexist) {
        await cart.updateOne(
          { userId: userid, "products.productId": productid },
          { $inc: { "products.$.quantity": 1, "products.$.price": price } }
        );
      } else {
        await cart.findOneAndUpdate(
          { userId: userid },
          {
            $push: {
              products: { productId: productid, quantity: 1, price: price },
            },
          }
        );
      }
    } else {
      await cart.create({
        userId: userid,
        products: { productId: productid, quantity: 1, price: price },
      });
    }
    res.json({ message: "success" });
  } catch (error) {
    console.log(error);
  }
};

// get user cart

const getCart =async (req, res) => {
  try {  
  let  userid= req.session.user.id;
  userName= req.session.user.username;
 
  let cartDataList= await cart.findOne(
      { userId:userid}
  ).populate("products.productId").lean();

  
  if(cartDataList){
    
    if (Array.isArray(cartDataList.products) && cartDataList.products.length !=0 && cartDataList.products.length !=null ) {
      
      let price=cartDataList.price
       

    const stocks = await Promise.all(cartDataList.products.map( async(i) => {  
      const stock = await product.findOne({ _id: i.productId._id }).lean();
      return stock; }));

    const cartList =await Promise.all(cartDataList.products.map(({
      productId,quantity,price}) => ({
        _id:productId._id,
        productname:productId.productname,
        price:productId.price,
        image:productId.image,
        price,
        quantity,
        stock:productId.stock
    })))
       const Grandtotal = cartList.reduce(
      (total, value) => total + value.price,
      0
     )
    
   
 res.render('user/cart', { user:true,userName,Grandtotal,cartList ,stocks})
  }
  else{
    res.render('user/emptycart',{user:true,userName})
  }

}
   else {
    res.render('user/emptycart',{user:true,userName})
  }
  } catch (error) {
     console.log(error.message);
    //  res.render('error500')

  }}





//delete cart items

const cartDelete = async (req, res) => {
  try {
    userid = req.session.user.id;
    await cart.updateOne(
        { userId: userid },
        { $pull: { products: { productId: req.query.id } } }
      )
      .lean();
    res.redirect("displaycart");
  } catch (error) {
    console.log(error);
  }
};



//update cart

const updateCart = async (req, res) => {
  try {
    
    const id = req.params.id;
   const quantity=parseInt(req.body.count)
     const userid=req.session.user.id
     
      if(quantity<=req.body.stock){
          const productprice=await product.findOne({_id:id})
      const price= productprice.price*quantity
      await cart.updateOne({userId:userid,"products.productId":id},{$set:{"products.$.quantity":quantity,"products.$.price":price}})
      await cart.updateOne({user_id:userid},{$set:{outstock:false}})
      const list=await cart.find({userId:userid}).populate("products.productId")
      let [{products}]=list
      const cartList=products.map(({productId,quantity,price})=>({
       _id:productId._id,
       price:productId.price,
       quantity,
       image:productId.image,
       price,
      }))
      const Grandtotal = cartList.reduce(
        (total, value) => total + value.price,
        0
       )
  res.json({status:true,
      data: {
          price:price,
          total:Grandtotal,
          nodata:""
        }
  })

      }else{
          res.json({status:false,data:"OUT OF STOCK"})
          await cart.updateOne({userId:userid},{$set:{outofstock:true}})
      }
      
   
  } catch (error) {
    console.log(error);
  }
}







module.exports = {
  addToCart,
  getCart,
  cartDelete,
  updateCart
};
