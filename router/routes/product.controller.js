
const {getProduct} = require("./product.service");
const {genSaltSync, hashSync} = require("bcrypt");


module.exports ={
getProduct:(req,res)=>
{
    const product = req.params;
    if(error)
    {
        console.log(error);
        return
    }
    if(!results)
    {
        return res.json({
            success:0,
            message: "Product Not Found"
        })
    }
    return res.json({
        success:1,
        data:results
    });

}
}