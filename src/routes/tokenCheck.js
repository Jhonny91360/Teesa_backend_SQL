const jwt= require('jsonwebtoken');
const secret=process.env.JWT_SECRET

const tokenCheck= async(req, res, next)=> {

    try {
    //Asi llega el token
    //Bearer yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
    if(!req.headers.authorization) return res.status(401).json({ mensaje: 'No se proporcionó un token' });
    const token = req.headers.authorization.split(" ")[1]

    if (!token) {
        return res.status(401).json({ mensaje: 'No se proporcionó un token' });
      }

    const payload= jwt.verify(token,secret)

    console.log("Lo que llega en el toke ",payload)

    if(Date.now()>payload.exp) return res.status(403).json({ mensaje: 'El token expiró' });
    next();


    } catch (error) {
        res.status(404).json({message:error.message})
    }
    
    
  }

  module.exports=tokenCheck