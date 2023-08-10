const nodemailer = require('nodemailer');

const mailContactUser= async(req,res)=>{
    const info= req.body;

    try {

        const transporter = nodemailer.createTransport({
            service: 'Gmail', // o cualquier otro servicio de correo
            auth: {
              user: 'ventas.online.teesa@gmail.com',
              pass: 'ykgvfuoerbyvaxom',
            },
          });
        
          const mailOptions = {
            from: 'ventas.online.teesa@gmail.com',
            to: ['jhonnyzamsa@hotmail.com','cuentadepruebaspam@gmail.com','ventas.online.teesa@gmail.com'],
            subject: 'Asistencia para venta - Teesa.online',
            html:`
              <h1>Este usuario requiere asesoria</h1>
              <hr>
              <p> <strong>Usuario:</strong> ${info.user.nombre} </p>
              <p> <strong>Direccion:</strong> ${info.user.direccion} </p>
              <p> <strong>Nit:</strong> ${info.user.nit} </p>
              <p> <strong>Telefono:</strong> ${info.user.celular} </p>
              <p> <strong>Correo:</strong> ${info.user.email} </p>
              <p> <strong>Ciudad:</strong> ${info.user.ciudad} </p>
              <p> <strong>Detalles:</strong> ${info.user.detalle} </p>
              <hr>
              <p> <strong>Productos:</strong> </p>
              ${info.cart.map(item => `
                <div>
                <ul>
                  <li><strong>Nombre del producto:</strong> ${item.Product.nombre}</li>
                  <li><strong>Cantidad:</strong> ${item.cantidad}</li>
                  <li><strong>Precio:</strong> ${item.precioTotal}</li>
                  <li><strong>Ref:</strong> ${item.Product.ref}</li>
                  <li><strong>Marca:</strong> ${item.Product.marca}</li>
                </ul>
                <img src="${item.Product.imagenes[0]}" alt="Imagen" width="100" />
                </div>
                `).join('')}
              <hr>
              <h1>Teesa s.a.s</h1>
              `
              };

              const mailInfo = await transporter.sendMail(mailOptions);
              console.log('Correo enviado:', mailInfo.response)

              res.status(202).json({message:"Correo enviado"})

    } catch (error) {
              res.status(400).json({message:error.message})
    }
}

module.exports=mailContactUser