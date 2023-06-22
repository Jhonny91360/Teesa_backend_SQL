const { Product } = require("../db")
const uuidRegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const cloudinary = require("../utils/cloudinary");

const updateProduct=async(req,res)=>{

    const {idProduct}=req.params
    if(!uuidRegExp.test(idProduct)) return res.status(400).json({message: "Id invalido"}) //Validacion de uuid

    const { imagenes, precio, stock } = req.body;
  

    try {
        const uploadedImages = [];
        if(imagenes.length>0){

        for (const imagen of imagenes) {
         const cloudinaryResponse = await cloudinary.uploader.upload(imagen, {
         folder: 'products'
         });

        const imageUrl = cloudinaryResponse.secure_url;
        uploadedImages.push(imageUrl);
         }
        }

        const product= await Product.findOne({ where: { id: idProduct } });

        if(product){
            
            product.imagenes = imagenes.length? uploadedImages : product.imagenes;
            product.precio = precio? precio:product.precio;
            product.stock = stock? stock: product.stock;
            
            const updatedProduct = await product.save();
            res.status(200).json(updatedProduct)
        }else{
            res.status(404).json({message:"Id no encontrado"})
        }
    } catch (error) {
            res.status(404).json({message:error.message})
    }
}

module.exports=updateProduct