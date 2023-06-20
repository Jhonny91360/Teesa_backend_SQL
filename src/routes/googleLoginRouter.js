const { Router } =require("express");
const googleLoginRouter = Router();
const {User} = require("../db")
const passport = require("passport");
const googleRouter = require("./google");





googleLoginRouter.get("/login", passport.authenticate("google-login", {scope: ['email','profile']}))

googleLoginRouter.get('/callback', passport.authenticate('google-login', { failureRedirect: 'https://pf-teesa-front.vercel.app/login', failureFlash: true }),async (req,res,next)=>{
  if (req.authError) {
    req.flash('error', req.authError);
    return res.redirect('https://pf-teesa-front.vercel.app/login');
  }

  const { emails } = req.user;

  const existingUser = await User.findOne({ where: { correo: emails[0].value } });
  try{
  if(existingUser&&existingUser.enable){
    const userData = {
      correo: existingUser.correo,
      nombre: existingUser.nombre,
      id: existingUser.id
    }

    const queryParams = new URLSearchParams(userData).toString();
    const redirectUrl = `https://pf-teesa-front.vercel.app/home?${queryParams}`;


    req.login(existingUser, err => {
      if (err) {
        console.error('Error al iniciar sesión:', err);
        return next(err);
      }
     
      return res.redirect(redirectUrl);
      
    });
    } else {
    // Usuario no existente, redirigir a la página de registro o mostrar un mensaje de error
    req.flash('error', 'Usuario no registrado');
    return res.redirect('https://pf-teesa-front.vercel.app/signup');
    }

  }
  catch(err){console.error('Error al buscar un usuario existente:', err);
                return next(err)}

})



 


  googleLoginRouter.get('/api/getErrorMessage', (req, res) => {
    const errorMessage = req.session.errorMessage || '';
    req.session.errorMessage = ''; // Borra el mensaje después de enviarlo
  
    res.json({ errorMessage });
  });





// //LOGOUT

// router.get('/logout', (req,res)=>{
//     req.logout(function(err) {
//         if (err) { console.log("Error al destruir la sesion: ",err )} 
//         res.redirect('/'); });

//     req.session.destroy()
//     ;
//     res.send('Adios')
// })


module.exports = googleLoginRouter;