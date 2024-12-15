var express = require('express');
var router = express.Router();
const Categories = require('../db/models/Categories');
const Response = require('../lib/Response');
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const AuditLogs = require('../lib/AuditLogs');
const logger = require('../lib/logger/loggerclas');
const auth = require("../lib/auth")();
const config = require("../config");
const i18n = new(require("../lib/i18n"))(config.DEFAULT_LANG);

router.all("*", auth.authenticate(), (req, res, next) => {
    next();
});
router.get('/',auth.checkRoles("category_view") ,async(req, res) => {  //http://localhost:3000/api/categories 
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

router.post("/add",auth.checkRoles("category_add") , async(req,res)=>{
    let body = req.body;
    try{

        if (!body.name) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,i18n.translate("COMMON.VALIDATION_ERROR_TITLE",req.user?.language),i18n.translate("COMMON.FIELD_MUST_BE_FILLED",req.user?.language,["NAME"]));

        let category = new Categories({
            name:body.name,
            isActive:true,
            created_by:req.user?._id


        });
        await category.save();

        AuditLogs.info(req.user?.email, "Categories", "Add", category);
        logger.info(req.user?.email, "Categories", "Add", category);

        res.json(Response.successResponse({success: true})) ;

    }catch (err){

        logger.error(req.user?.email, "Categories", "Add", err);
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code). json(errorResponse);
    }

    });
    
    router.post("/update",auth.checkRoles("category_update"),async(req,res)=>{
        let body = req.body;
        try{
            if(!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,i18n.translate("COMMON.VALIDATION_ERROR_TITLE",req.user?.language),i18n.translate("COMMON.FIELD_MUST_BE_FILLED",req.user?.language,["_id"]));
            
            let updates = {};

            if (body.name) updates.name = body.name;
            if (typeof body.is_active === "boolean") updates.is_active = body.is_active;
            
            await Categories.updateOne({_id:body._id},updates);

            AuditLogs.info(req.user?.email,"Categories","Update", {_id:body._id,...updates});

            res.json(Response.successResponse({success: true})) ;
        }catch(err) {
            let errorResponse = Response.errorResponse(err);
            res.status(errorResponse.code).json(errorResponse);
        }
    });
    router.post("/delete",auth.checkRoles("category_delete"), async(req,res)=>{
        let body = req.body;

        try {
            if(!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,i18n.translate("COMMON.VALIDATION_ERROR_TITLE",req.user?.language),i18n.translate("COMMON.FIELD_MUST_BE_FILLED",req.user?.language,["_id"]));

            await Categories.deleteOne({_id:body._id});

            AuditLogs.info(req.user?.email,"Categories","Delete", {_id:body._id});


            res.json(Response.successResponse({success: true})) ;

        } catch (err) {

            let errorResponse = Response.errorResponse(err);

            res.status(errorResponse.code).json(errorResponse);
        }
    });
    module.exports = router; //router'ı export et.