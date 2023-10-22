const { Product } = require("../db");
const uuidRegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const handleEnableProduct=async(req,res)=>{

        try {
            const {idProduct}=req.params
            const {enable}=req.query
    
            if(!uuidRegExp.test(idProduct)) return res.status(400).json({message: "Id invalido"}) //Validacion de uuid
    
            if(!enable   || !typeof enable === 'boolean'  ) return  res.status(400).json({message: "enable debe ser tipo boolean"})
    
            const product= await Product.findOne({ where: { id: idProduct } });
    
            if(product){
                product.enable= enable
                const updatedProduct= await product.save();
                return res.status(200).json(updatedProduct)
    
            }else{
                res.status(404).json({message:"Producto no encontrado(id invalido)"})
            }
        } catch (error) {
            res.status(400).json({message:error.message})
        }
       
    }

module.exports=handleEnableProduct;
