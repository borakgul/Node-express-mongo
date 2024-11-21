var express = require('express');
var router = express.Router();
const Categories = require('../db/models/Categories');
const Response = require('../lib/Response');
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const { name } = require('ejs');

router.get('/', async(req, res, next) => {  //http://localhost:3000/api/categories 
  try {
      let categories = await Categories.find({});  
       //tüm kategorileri getir.
      res.json(Response.successResponse(categories)); // data verisini yollayacağız burada categories olacak.
  }
    catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(Response.errorResponse(err));
    }
});

router.post("/add",async(req,res)=>{
    let body = req.body;
    try{

        if (!body.name) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,"Validation Error","Name field must be filled.");

        let category = new Categories({
            name:body.name,
            isActive:true,
            created_by:req.user?._id


        });
        await category.save();

        res.json(Response.successResponse({success: true})) ;

    }catch (err){

        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }

    });
    
    router.post("/update",async(req,res)=>{
        let body = req.body;
        try{
            if(!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,"Validation Error","_id field must be filled.");
            
            let updates = {};

            if (body.name) updates.name = body.name;
            if (typeof body.is_active === "boolean") updates.is_active = body.is_active;
            
            await Categories.updateOne({_id:body._id},updates);
            res.json(Response.successResponse({success: true})) ;
        }catch(err) {
            let errorResponse = Response.errorResponse(err);
            res.status(errorResponse.code).json(errorResponse);
        }
    });
    router.post("/delete",async(req,res)=>{
        let body = req.body

        try {
            if(!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,"Validation Error","_id field must be filled.");

            await Categories.deleteOne({_id:body._id});

            res.json(Response.successResponse({success: true})) ;

        } catch (err) {

            let errorResponse = Response.errorResponse(err);

            res.status(errorResponse.code).json(errorResponse);
        }
    })
    module.exports = router; //router'ı export et.