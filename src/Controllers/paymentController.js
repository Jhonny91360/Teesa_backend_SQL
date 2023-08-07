const mercadopago= require("mercadopago");
const {Cart} = require("../db");
const {CartProducts} = require("../db");

const createOrder = async (req,res)=>{
    const {id} = req.params;
    try{

    mercadopago.configure({
        //access_token:"TEST-6291707727318397-080115-94a23194e5ec1601243fd310cf7dd056-1439388864" //vendedor prueba 
        //toke teesa:APP_USR-5406266318410811-080416-fe0c71c68815bfeebeadb435586f510f-1281028042
         access_token:"APP_USR-5406266318410811-080416-fe0c71c68815bfeebeadb435586f510f-1281028042"
        //client_id: "5406266318410811",
        //client_secret:"1NDx7BVinjZUhlPEne9t4eRPtEmIiv02"
    
    })

    // MANDAR POR GOOGLE ID
    // Manden por req.params id Usuario
    // id Usuario -> id Carrito que le corresponde
    // Cart Productos traigo todos los productos y cantidades sumar el total de precio de todos los productos

    

    let precioTotal = 0;
    const carrito = await Cart.findOne({where:{UserId: id}});
    const products = await CartProducts.findAll({where:{CartId:carrito.dataValues.id}, attributes: ['precioTotal']})
    products.map(prod=>precioTotal += prod.dataValues.precioTotal)

    


    ///Crear una orden de compra
    const result = await mercadopago.preferences.create({
        
        items: [{
            title: 'Productos Teesa',
            unit_price: Number(precioTotal),
            quantity:1,
            currency_id: "COP"

        }],
        back_urls: {
            success: "https://www.teesa.online/checkoutsuccess",
            failure: "https://www.teesa.online/checkoutfailed",
            pending: "https://www.teesa.online/checkoutpending"
        },
        external_reference: `${id},${carrito.dataValues.id}`,
        notification_url: 'https://teesa-backend.onrender.com/mercadopago/webhook'
        // notification_url: 'https://35d9-2800-484-e882-90e4-e450-ad55-4d12-f2dc.ngrok.io/mercadopago/webhook'
    })

    

    res.status(202).json(result.body.init_point)
}
    catch(err){
        console.log(err)
        res.sendStatus(400).json({message:err.message})
    }

};


module.exports = createOrder


///// SOLO PARA RPUEBAS EN EL BACK
// const{ Cart }=require("../db")
// const{ User }=require("../db")
// const{ CartProducts }=require("../db")
// const{ Product }=require("../db")

// const uuidRegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// const transformCart=(user)=>{

//   return user.Cart.CartProducts.map( item=>{

//           return{
//               nombre:item.Product.nombre,
//               precio:item.Product.precio,
//               cantidad:item.cantidad,
//               total:(item.cantidad)*item.Product.precio
//               }
//           })
//   }



// const getCartProducts=async(req,res)=>{

//     try {
//         const {idUser}=req.params
//         if(!uuidRegExp.test(idUser)) return res.status(400).json({message: "Id invalido"}) //Validacion de uuid

//         const user = await User.findByPk(idUser, {
//             // where:{id:idUser},
//             attributes:[],
//             include: {
//               model: Cart,
//               include: {
//                 model: CartProducts,
//                 include: {
//                   model: Product,
//                   attributes: ['nombre','precio'],
//                 },
//                 attributes: ['cantidad', 'ProductId'],
//               },
//             },
//           });


//         if(user)
//             res.status(200).json( transformCart(user));
//         }else{
//             res.status(404).json({message:"no se encontro una mierda"})
//         }
//     } catch (error) {
//         res.status(400).json({message:error.message})
//     }

// }

// module.exports=getCartProducts