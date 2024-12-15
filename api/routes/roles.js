var express = require('express');
var router = express.Router();  
const Roles = require('../db/models/Roles');
const CustomError = require('../lib/Error');
const Response = require('../lib/Response');
const Enum = require('../config/Enum');
const role_privileges = require('../config/role_privileges');
const RolePrivileges = require('../db/models/RolePrivileges');
const config = require("../config");
const auth = require('../lib/auth')();  
const i18n = new (require("../lib/i18n"))(config.DEFAULT_LANG);

router.all("*",auth.authenticate(),(req,res,next)=>{
    next();
});

router.get("/", auth.checkRoles("role_view"), async (req, res) => {
    try {
        let roles = await Roles.find({});

        res.json(Response.successResponse(roles));

    } catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
        
    }
});

router.post('/add',auth.checkRoles("role_add"),async(req, res, next) => {
    let body = req.body;

    try {

        if (!body.role_name) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, i18n.translate("COMMON.VALIDATION_ERROR_TITLE",req.user?.language),i18n.translate("COMMON.FIELD_MUST_BE_FILLED",req.user?.language,["user name"]));

        if (!body.permissions || !Array.isArray(body.permissions) || body.permissions.length === 0) {

            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),i18n.translate("COMMON.FIELD_MUST_BE_TYPE", req.user.language, ["permissions", "Array"]));        }

        let role = new Roles({
            role_name: body.role_name,
            is_active: true,
            created_by: req.user?.id //req.user varsa _id al, yoksa null al. 
        });

        await role.save();
 
        for (let i=0; i<body.permissions.length; i++) {
            let priv = new RolePrivileges({
                role_id: role._id,
                permission: body.permissions[i],
                created_by: req.user?.id
            });
            await priv.save();
        }

        res.json(Response.successResponse({ success: true }));

    } catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);

    }
});
router.post("/update",auth.checkRoles("role_update"), async (req, res) => {
    let body = req.body;
    try {
        if (!body._id) {
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),
            i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, ["_id"]));
        }

        // Role bilgilerini güncelle
        let updates = {};
        if (body.role_name) updates.role_name = body.role_name;
        if (typeof body.is_active === "boolean") updates.is_active = body.is_active;

        await Roles.updateOne({ _id: body._id }, updates);

        // Permissions güncelleme
        if (body.permissions && Array.isArray(body.permissions) && body.permissions.length > 0) {
            // Eski izinleri al
            let existingPermissions = await RolePrivileges.find({ role_id: body._id });
           

            // Silinecek izinler
            let removedPermissions = existingPermissions.filter(existing => !body.permissions.includes(existing.permission));
            
            if (removedPermissions.length > 0) {
                await RolePrivileges.deleteMany({ _id: { $in: removedPermissions.map(x => x._id) } });
            }

            // Eklenmesi gereken yeni izinler
            let newPermissions = body.permissions.filter(newPerm => !existingPermissions.some(existing => existing.permission === newPerm));
           

            if (newPermissions.length > 0) {
                let newPrivileges = newPermissions.map(permission => ({
                    role_id: body._id,
                    permission,
                    created_by: req.user?.id || null,
                }));
              

                await RolePrivileges.insertMany(newPrivileges);
            }
        }

        res.json(Response.successResponse({ success: true }));
    } catch (err) {
       // console.error("Update Error:", err); // error handling
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});
router.post('/delete',auth.checkRoles("role_delete") , async (req, res) => {
    let body = req.body;

    try {
        if (!body._id) {
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),
            i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, ["_id"]));
        }

        // Roles modelindeki remove metodunu çağır
        await Roles.remove({ _id: body._id });
        res.json(Response.successResponse({ success: true }));
    } catch (err) {
        let errorResponse = Response.errorResponse(err);
        const statusCode = errorResponse.code || 500; // Varsayılan durum kodu
        res.status(statusCode).json(errorResponse);
    }
});



router.get('/role_privileges', async(req, res, next) => { 

    res.json(role_privileges);
});

module.exports = router;
