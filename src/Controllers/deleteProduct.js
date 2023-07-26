const { Product } = require("../db")
const uuidRegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const deleteProduct=async(req,res)=>{

    const {idProduct}=req.params
    if(!uuidRegExp.test(idProduct)) return res.status(400).json({message: "Id invalido"}) //Validacion de uuid

    try {
        //Encuentro producto para eliminar la imagenes guardadas en cloudinary
        const product= await Product.findOne({ where: { id: idProduct } });
        for (const imagen of product.imagenes) {
            let publicId = await cloudinary.url(imagen, { type: 'upload' }).split('/').pop().split('.')[0];
            publicId=`products/${publicId}`
            const clodinaryDelete= await cloudinary.uploader.destroy(publicId)
        }

        const productDeleted= await Product.destroy({
            where:{
                id:idProduct
            }
        })

        if(productDeleted){
            res.status(200).json({message:`El producto de id ${idProduct} fue eliminado `})
        }else{
            res.status(404).json({message:"Id no encontrado"})
        }
    } catch (error) {
        res.status(404).json({message:error.message})
    }
}

module.exports=deleteProduct