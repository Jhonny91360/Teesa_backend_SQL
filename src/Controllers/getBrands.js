const { Product } = require("../db");

const getBrands = async(req,res)=>{
    try{
        const allProducts = await Product.findAll();
        const uniqueBrands = new Set(allProducts.map((product) => product.marca.trim()));
        const brands = [...uniqueBrands];

        res.status(200).json(brands)
    }
    catch(err){res.status(404).json({message: "Catch de getAllProducts "+err.message})}
}

module.exports = getBrands