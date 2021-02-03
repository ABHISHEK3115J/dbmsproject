const express = require('express');
const User = require('../models/User');
const app = express();
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport')
router.get('/',(req,res)=>{
res.render('login')
})


router.get('/register',(req,res)=>{
   res.render('register'); 
})

router.post('/register',(req,res)=>{
    const {rvce_ID,email,password,password2} = req.body;
    let errors = [];
    if(!rvce_ID||!email||!password||!password2)
     {
         errors.push({msg:'Please fill all the details'});
     }
     if(password!=password2){
         errors.push({msg:'Passwords do not match'});
     }
     if(password.length<6){
      errors.push({msg:'Password should be atleast 6 characters'});
     }
     if(errors.length > 0){
         res.render('register',{
             errors,
             rvce_ID,
             email,
             password,
             password2
         });
     }
     else{
       User.findOne({rvce_ID:rvce_ID})
       .then(user =>{
           if(user){
            errors.push({msg:'ID is already present'});
            res.render('register',{
                errors,
                rvce_ID,
                email,
                password,
                password2
            });
           }
           else{
               const newUser = new User({
                   rvce_ID:rvce_ID,
                   email:email,
                   password:password
               });
               bcrypt.genSalt(10,(err,salt) =>bcrypt.hash(newUser.password,salt,(err,hash) =>{
                       if(err) throw err;
                     newUser.password = hash;
                     newUser.save()
                     .then(user => {
                         req.flash('success_msg','You now are registered and can login')
                         res.render('login')
                     })
                     .catch(err => console.log(err));

               }))
           }
       })  
     }
});

router.post('/',(req,res,next)=>{
passport.authenticate('local',{
    successRedirect:'/index',
    failureRedirect:'/',
    failureFlash:true
})(req,res,next);
})

router.get('/logout',(req,res) =>{
    req.logOut();
    req.flash('success_msg','You are logged out');
    res.redirect('/');
})
module.exports = router;



