const { Product } = require("../db")
const cloudinary = require("../utils/cloudinary");
const allowedExtensions = ["jpg", "jpeg", "png"];

const addProducts= async (req,res)=>{

    console.log("Me llega para crear producto: ",req);
    const { nombre, tipo, caracteristicas, categoria, imagenes, precio, stock, marca, descripcion, ref, estado } = req.body;
        
    //console.log("Esto me llega : "+req.file)


    if(!nombre || !imagenes || !precio || !marca || !ref) return res.status(404).json({message: "Faltan datos"})

    const proExist = await Product.findOne({where:{nombre, ref}});
    console.log(proExist);
    if(proExist) return res.status(400).json({message: "Producto ya existe"})
    

    try{
        const uploadedImages = [];
        for (const imagen of imagenes) {
            //const fileExtension = imagen.split('.').pop().toLowerCase();
            // if (!allowedExtensions.includes(fileExtension)) {
            //   return res.status(400).json({ message: "Por favor, selecciona un archivo de imagen en formato JPG o PNG" });
            // }
            const cloudinaryResponse = await cloudinary.uploader.upload(imagen, {
        folder: 'products'
      });
      const imageUrl = cloudinaryResponse.secure_url;
      uploadedImages.push(imageUrl);
    }
    const newProduct = await Product.create({nombre, tipo, caracteristicas, categoria, imagenes:uploadedImages, precio, stock, marca, descripcion, ref, estado})
    res.status(200).json(newProduct)
    }catch(err){res.status(404).json({message: "Llegue al catch del post de productos "+ err.message})}

}

module.exports = addProducts;