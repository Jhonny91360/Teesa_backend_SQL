const { Router } = require ("express");
const mercadopago = require("mercadopago");
const paymentRouter = Router();
const createOrder = require("../Controllers/paymentController");
const {CartProducts, Cart, User, Product, Purchased}= require("../db");
const nodemailer = require('nodemailer');

paymentRouter.post('/create_order/:id', createOrder)

// paymentRouter.get('/checkoutsuccess',async (req,res)=>{
   
   


//     // productos.map(  async (prod)=>{
//     //     await Purchased.create({idCompra: merchant_order_id, UserId: user, idProducto: prod.ProductId, precio: prod.precioTotal, cantidad: prod.cantidad  },{include: [User]})
//     // })


//     res.redirect("https://pf-teesa-front.vercel.app/checkoutsuccess")
// })

paymentRouter.post('/webhook', async (req,res)=>{
    
    const payment = req.query;
    const informacion=req.body;
    console.log('Me llega por query: ',payment)
    console.log("Me llega por body: ",informacion)
 //
    try {
    if(payment.type === 'payment'){
        const data = await mercadopago.payment.findById(payment['data.id']);
        const info = data.body.external_reference?.split(",")
        const userId = info[0];
        const cartId = info [1];

        const productos = await CartProducts.findAll({where:{CartId:cartId}, raw:true}) 
        // productos.map(async (prod)=>{
        //     await Purchased.create({idCompra:data.body.order.id, UserId: userId, ProductId: prod.ProductId, precio: prod.precioTotal, cantidad: prod.cantidad }, {include: [{model: User}, {model: Product}]})
        // })
        await Promise.all(productos.map(async (prod) => {
            await Purchased.create({
                idCompra: data.body.order.id,
                UserId: userId,
                ProductId: prod.ProductId,
                precio: prod.precioTotal,
                cantidad: prod.cantidad
            }, { include: [{ model: User }, { model: Product }] });
        }));

        //Info para mailer
        console.log("id compra: ", data.body.order.id)

        const compra = await Purchased.findAll({where:{idCompra:data.body.order.id},
            include: [{
                model: Product,
                attributes: ['nombre','imagenes' ]
              },
              {
                model: User,
                attributes: ['id','nombre','direccion','nit',
                'telefono','correo','ciudad','detalles' ]
              }]
        })
      
        console.log("Info Purchased idCompra: ",JSON.stringify(compra,null,2))
        ///
        let obj={
            idCompra:compra[0]?.idCompra,
            User:  compra[0]?.User.dataValues,
            fechaCompra:new Date(compra[0]?.fechaDeCompra),
            Productos: compra?.map( item=>{
                return{
                    productName:item.Product.nombre,
                    cantidad:item.cantidad,
                    precio:item.precio,
                    imagen:item.Product.imagenes[0]
                }
            })
                //{productName:"",cantidad:0,precio:0,imagen:""}      
        }

        console.log("Info organizada para mailer: ",obj)
        
        //////////////         Mailer   //////////////////////

        const transporter = nodemailer.createTransport({
            service: 'Gmail', // o cualquier otro servicio de correo
            auth: {
              user: 'ventas.online.teesa@gmail.com',
              pass: 'ykgvfuoerbyvaxom',
            },
          });

        const mailOptions = {
            from: 'ventas.online.teesa@gmail.com',
            to: ['jhonnyzamsa@hotmail.com'],
            subject: 'Confirmacion de compra - Teesa.online',
            html:`
              <h1>Compra realizada</h1>
              <hr>
              <p> <strong>Compra:</strong> ${obj.idCompra} </p>
              <p> <strong>Usuario:</strong> ${obj.User.nombre} </p>
              <p> <strong>Direccion:</strong> ${obj.User.direccion} </p>
              <p> <strong>Nit:</strong> ${obj.User.nit} </p>
              <p> <strong>Telefono:</strong> ${obj.User.telefono} </p>
              <p> <strong>Correo:</strong> ${obj.User.correo} </p>
              <p> <strong>Ciudad:</strong> ${obj.User.ciudad} </p>
              <p> <strong>Detalles:</strong> ${obj.User.detalles} </p>
              <hr>
              <p> <strong>Productos:</strong> </p>
              ${obj.Productos.map(item => `
                <div>
                <ul>
                  <li><strong>Nombre del producto:</strong> ${item.productName}</li>
                  <li><strong>Cantidad:</strong> ${item.cantidad}</li>
                  <li><strong>Precio:</strong> ${item.precio}</li>
                </ul>
                <img src="${item.imagen}" alt="Imagen" width="100" />
                </div>
                `).join('')}
              <hr>
              <h1>Teesa s.a.s</h1>
              `
              };

              const mailInfo = await transporter.sendMail(mailOptions);
              console.log('Correo enviado:', mailInfo.response)
    }

    res.sendStatus(204)}
    catch(err){ 
        console.log("Error generado: ",err.message)
        res.status(500).json({error:err.message})
    }
})


module.exports = paymentRouter;

    // const { user, precioTotal, merchant_order_id, carrito } =req.query;

    // const productos = await CartProducts.findAll({where:{CartId:carrito},raw:true});
    
    //     // productos.map(  async (prod)=>{
//     //     await Purchased.create({idCompra: merchant_order_id, UserId: user, idProducto: prod.ProductId, precio: prod.precioTotal, cantidad: prod.cantidad  },{include: [User]})
//     // })