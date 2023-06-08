const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,20}$/;  //1 Mayus,1 Num,1 car.esp, 6-20
const bcryptjs=require('bcryptjs')

const { User } = require("../db");
const { Op } = require('sequelize');

const addUser=async(req,res)=>{

    try {
        const{nombre,direccion,telefono,nit,correo,contrasena,tipo}= req.body
    
        if (!emailRegex.test(correo)) {
            return res.status(404).json({message:"Correo invalido"})
        }
        if (!passwordRegex.test(contrasena)) {
            return res.status(404).json({message:"Contraseña invalida"})
        }

        const contrasenaHash= await bcryptjs.hash(contrasena,8) //8 numero de saltos, mayor numero mas seguro pero mas lento

        const [usuario,creado]= await User.findOrCreate({
            where:{
                [Op.or]:[{correo},{nit}]
            },
            defaults:{
                nombre,direccion,telefono,nit,correo,contrasena:contrasenaHash,tipo
            }
        })
        if(creado){
            return res.status(200).json({message:"Usuario creado"})
        }else{
            return res.status(400).json({message:"Ya existe un usario con ese correo o nit"})
        }

        

    } catch (error) {
        res.status(404).json({message:error.message})
    }
    
}

module.exports=addUser