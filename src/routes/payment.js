const { Router } = require ("express");
const mercadopago = require("mercadopago");
const paymentRouter = Router();
const createOrder = require("../Controllers/paymentController");
const {CartProducts, Cart, User, Product, Purchased}= require("../db");


paymentRouter.post('/create_order/:id', createOrder)

// paymentRouter.get('/checkoutsuccess',async (req,res)=>{
   
   


//     // productos.map(  async (prod)=>{
//     //     await Purchased.create({idCompra: merchant_order_id, UserId: user, idProducto: prod.ProductId, precio: prod.precioTotal, cantidad: prod.cantidad  },{include: [User]})
//     // })


//     res.redirect("https://pf-teesa-front.vercel.app/checkoutsuccess")
// })

paymentRouter.post('/webhook', async (req,res)=>{
    
    const payment = req.query;

    const resultadoPayment=  await mercadopago.payment.findById(payment['data.id']);
    console.log('Info de la transaccion: ',resultadoPayment)
    
    try {
    if(payment.type === 'payment'){
        const data = await mercadopago.payment.findById(payment['data.id']);
        const info = data.body.external_reference?.split(",")
        const userId = info[0];
        const cartId = info [1];

        const productos = await CartProducts.findAll({where:{CartId:cartId}, raw:true}) 
        productos.map(async (prod)=>{
            await Purchased.create({idCompra:data.body.order.id, UserId: userId, ProductId: prod.ProductId, precio: prod.precioTotal, cantidad: prod.cantidad }, {include: [{model: User}, {model: Product}]})
        })


        console.log(data.body.order.id);
        console.log(cartId);

    
        // Aqui se puede guardar en base de datos. Guardar en base de datos Purchased. Modificar el modelo con order id, total precio y estado de pedido
    }

    res.sendStatus(204)}
    catch(err){ res.status(500).json({error:err.message})}
})


module.exports = paymentRouter;

    // const { user, precioTotal, merchant_order_id, carrito } =req.query;

    // const productos = await CartProducts.findAll({where:{CartId:carrito},raw:true});
    
    //     // productos.map(  async (prod)=>{
//     //     await Purchased.create({idCompra: merchant_order_id, UserId: user, idProducto: prod.ProductId, precio: prod.precioTotal, cantidad: prod.cantidad  },{include: [User]})
//     // })