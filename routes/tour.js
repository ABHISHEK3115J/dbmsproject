var express = require('express');
var router = express.Router();
//var dbConn  = require('../config/db.config');
router.get('/',(req,res)=>{
    res.render('hostelTour');
})
router.get('/cauvery',(req,res)=>{
res.render('cauvery');
})
router.get('/chamundi',(req,res)=>{
res.render('chamundi');
})
router.get('/DJ',(req,res)=>{
res.render('DJ');
})
router.get('/MV',(req,res)=>{
res.render('MV');
})
router.get('/krishnagarden',(req,res)=>{
 res.render('krishnagarden');
 })
 router.get('/girlshostel',(req,res)=>{
    res.render('girlshostel');
})
module.exports = router;