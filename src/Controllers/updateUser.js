const{ User }=require("../db")
const jwt= require('jsonwebtoken');
const secret=process.env.SECRET

const uuidRegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const updateUser=async(req,res)=>{
    const {idUser}=req.params
    if(!uuidRegExp.test(idUser)) return res.status(400).json({message: "Id invalido"}) //Validacion de uuid
    let{nombre,direccion,telefono,nit,ciudad,detalles}= req.body
    
   try {
    const user= await User.findOne({ where: { id: idUser } });
    if(user){
        user.nombre=nombre;
        user.direccion=direccion;
        user.telefono=telefono;
        user.nit=Number(nit);
        user.ciudad=ciudad;
        user.detalles=detalles;
        const updatedUser= await user.save();
        //Regenerar token con nueva info///
        const token=jwt.sign({
            sub:user.id,
            nombre:user.nombre,
            exp:Date.now()+60*2000, //2min
            tipo:user.tipo,
            direccion:user.direccion,
            telefono:user.telefono,
            nit:user.nit,
            correo:user.correo, 
            ciudad:user.ciudad,
            detalles:user.detalles        
        },secret)

        return res.status(200).json({token})
        //res.status(200).json(updatedUser);
    }
    else{
        res.status(404).json({message:"Usuario no encontrado(id invalido)"})
    }
    } catch (error) {
        res.status(400).json({message:error.message})
    }

}

module.exports=updateUser