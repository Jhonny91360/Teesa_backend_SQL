const { Router } =require("express");
const googleRouter = Router();
const passport = require("passport")
const {User} = require("../db");
const {URL_FRONT} = process.env;



//SIGNUP

googleRouter.get("/signup", passport.authenticate("google-signup", {scope: ['email','profile']}))


googleRouter.get('/callback', (req, res, next) => {

                                                              
      passport.authenticate('google-signup', { failureRedirect: `${URL_FRONT}/signup`, failureFlash: true }, (err, user) => {
      if (err) {
        console.error('Error en la autenticación de Google:', err);
                          
        return res.redirect(`${URL_FRONT}/signup`);
      }
      if (!user) {
        req.session.errorMessage = 'Error en la autenticación de Google';
                         
        return res.redirect(`${URL_FRONT}/signup`);
      }
  
      const { displayName, emails, accessToken, refreshToken, id } = user;
      User.findOne({ where: { correo: emails[0].value } })
        .then(async (existingUser) => {
          if (existingUser) {
           
            const userData = {
              correo: existingUser.correo,
              nombre: existingUser.nombre,
              id: existingUser.id
            }
            if(existingUser.enable){
            const queryParams = new URLSearchParams(userData).toString();
                              
            const redirectUrl = `${URL_FRONT}/home?${queryParams}`;
            return res.redirect(redirectUrl); //definir con el front que ruta vamos a mostrar para decirle al cliente que ya existe
          }
            else {
              await User.update({enable:true}, {where:{correo:emails[0].value }});
              const queryParams = new URLSearchParams(userData).toString();
                                //'https://pf-teesa-front.vercel.app/signup'
              const redirectUrl = `${URL_FRONT}/home?${queryParams}`;
              return res.redirect(redirectUrl);
            }
          }
  
          User.create({ nombre: displayName, correo: emails[0].value, googleToken: accessToken, refreshToken, tipo: false})
            .then(newUser => {
              const userData = {
                correo: newUser.correo,
                nombre: newUser.nombre,
                id: newUser.id
            }
            const queryParams = new URLSearchParams(userData).toString();
                              //'https://pf-teesa-front.vercel.app/signup'
            const redirectUrl = `${URL_FRONT}/home?${queryParams}`;
              
              res.redirect(redirectUrl);
            })
            .catch(error => {
              console.error('Error al crear un nuevo usuario:', error);
              next();
            });
        })
        .catch(error => {
          console.error('Error al buscar un usuario existente:', error);
          next();
        });
    })(req, res, next);
    
  });

googleRouter.get('/api/getErrorMessage', (req, res) => {
    const errorMessage = req.session.errorMessage || '';
    req.session.errorMessage = ''; // Borra el mensaje después de enviarlo
  
    res.json({ errorMessage });
  });


//LOGIN

  // // MIDDLEWARE PARA COMPROBAR QUE EL USUARIO ESTA REGISTRADO

// const isSignedUp = async (req,res,next)=>{

//     if(req.user){
//         const userExist = await User.findOne({where: {correo: req.user.emails[0].value}})
//         if(userExist) return res.status(401).json({message: "Usuario ya registrado"})
//         next()
//     }
    
//     else {res.status(401).json({message: "Usuario no registrado"})}
// }

// router.get('/login', isSignedUp, (req,res)=>
// {
// res.status(201).json({message: "Registro Exitoso"})})





module.exports = googleRouter