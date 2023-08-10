const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,20}$/;  //1 Mayus,1 Num,1 car.esp, 6-20
const bcryptjs=require('bcryptjs')
const nodemailer = require('nodemailer');

const { User, Cart } = require("../db");
const { Op } = require('sequelize');

const addUser=async(req,res)=>{

    try {
        let{nombre,direccion,telefono,nit,correo,contrasena,tipo=false, enable=true}= req.body
    
        if (!emailRegex.test(correo)) {
            return res.status(404).json({message:"Correo invalido"})
        }
        if (!passwordRegex.test(contrasena)) {
            return res.status(404).json({message:"Contraseña invalida"})
        }

        const contrasenaHash= await bcryptjs.hash(contrasena,8) //8 numero de saltos, mayor numero mas seguro pero mas lento

        if(!direccion) direccion="";
        if(!telefono) telefono="";
        if(!nit) nit=0;
        

        const [usuario,creado]= await User.findOrCreate({
            where:{
                [Op.or]:[{correo}]
            },
            defaults:{
                nombre,direccion,telefono,nit,correo,contrasena:contrasenaHash,tipo,enable
            }
        })

        const transporter = nodemailer.createTransport({
            service: 'Gmail', // o cualquier otro servicio de correo
            auth: {
              user: 'ventas.online.teesa@gmail.com',
              pass: 'ykgvfuoerbyvaxom',
            },
          });
        
        if(creado){
            const cart = await Cart.create();
            await cart.setUser(usuario); //pronto se crea el usuario se crea una cart asignado al mismo

            //mailer
            const mailOptions = {
                from: 'ventas.online.teesa@gmail.com',
                to: [correo,'ventas.online.teesa@gmail.com'],
                subject: 'Creacion de cuenta - Teesa.online',
                html:`
                <h1>Bienvenido a Teesa</h1>
                <p>Su cuenta ha sido creada exitosamente</p>
                `
              };
            //
            const mailInfo = await transporter.sendMail(mailOptions);
            console.log('Correo enviado:', mailInfo.response)

            return res.status(200).json({usuario, cart})
        }else{
            //Aqui va la lógica para usuario inhabilitado
            if(!usuario.enable) {
                usuario.enable=true;
                await usuario.save();
                const mailOptions = {
                    from: 'ventas.online.teesa@gmail.com',
                    to: [correo,'ventas.online.teesa@gmail.com'],
                    subject: 'Reactivacion de cuenta - Teesa.online',
                    html:`
                    <h1>Bienvenido de nuevo a Teesa</h1>
                    <p>Su cuenta se ha reactivado</p>
                    `
                  };
                //
                const mailInfo = await transporter.sendMail(mailOptions);
                console.log('Correo enviado:', mailInfo.response)
                
                return res.status(202).json({message:"Se reestablecio usuario"})
            }else{
                return res.status(400).json({message:"Ya existe un usario con ese correo"})
            }
            
        }

        

    } catch (error) {
        res.status(404).json({message:error.message})
    }
    
}

module.exports=addUser