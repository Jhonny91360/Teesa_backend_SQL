const {User} = require("../db")

const getUserByID = async(req,res)=>{

    const {id} = req.params;

    try {

        const usuario = await User.findOne({where:{id}})

        if(usuario){

        const usuarioEncontrado = {
            nombre: usuario.nombre, 
            direccion: usuario.direccion,
            telefono: usuario.telefono,
            nit: usuario.nit,
            correo:usuario.correo,
            ciudad:usuario.ciudad,
            detalles:usuario.detalles,
        }

        return res.status(200).json(usuarioEncontrado)
    }
    else {res.status(400).json({message: "Usuario no encontrado"})}


        
    } catch (error) {
        res.status(500).json({message:error.message})
    }

}

module.exports = getUserByID