const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const is_js = require('is_js');
const Users = require('../db/models/Users');
const Response = require('../lib/Response');
const CustomError = require('../lib/Error');
const Enum = require('../config/Enum');
const UserRoles = require('../db/models/UserRoles');
const Roles = require('../db/models/Roles');
const mongoose = require('mongoose');


const router = express.Router();

/* GET users listing */
router.get('/', async (req, res) => {
    try {
        let users = await Users.find({});
        res.json(Response.successResponse(users));
    } catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code || 500).json(errorResponse);
    }
});

/* POST add user */
router.post('/add', async (req, res) => {
    let body = req.body;
    try {
        if (!body.email) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "Email field must be filled.");
        if (is_js.not.email(body.email)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "Email is not valid.");
        if (!body.password) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "Password field must be filled.");
        if (body.password.length < Enum.PASSLENGTH) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "Password must be at least 8 characters long.");
        if (!body.roles || !Array.isArray(body.roles) || body.roles.length === 0) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "Roles field must be an array.");

        let roles = await Roles.find({ _id: { $in: body.roles } });
        if (roles.length === 0) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "Invalid roles provided.");

        let password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8), null);

        let user = await Users.create({
            email: body.email,
            password,
            is_active: true,
            first_name: body.first_name,
            last_name: body.last_name,
            phone_number: body.phone_number
        });

        for (let role of roles) {
            await UserRoles.create({ role_id: role._id, user_id: user._id });
        }

        res.status(Enum.HTTP_CODES.CREATED).json(Response.successResponse({ success: true }, Enum.HTTP_CODES.CREATED));
    } catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code || 500).json(errorResponse);
    }
});

/* POST update user */
router.post('/update', async (req, res) => {
  let body = req.body;
  let updates = {};

  try {
      if (!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "id field must be filled.");

      // Güncellemeler
      if (body.password && body.password.length < Enum.PASSLENGTH) {
          updates.password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8), null);
      }
      if (body.first_name) updates.first_name = body.first_name;
      if (body.last_name) updates.last_name = body.last_name;
      if (typeof body.is_active === "boolean") updates.is_active = body.is_active;
      if (body.phone_number) updates.phone_number = body.phone_number;

      // Role güncelleme işlemleri
      if (Array.isArray(body.roles) && body.roles.length > 0) {
        console.log("User ID:", body._id);
        let userRoles = await UserRoles.find({ user_id: body._id });
        console.log("Incoming Roles:", body.roles);
        console.log("User Roles from DB:", userRoles);
          // Silinecek roller
          let removedRoles = userRoles.filter(x => !body.roles.includes(x.role_id.toString()));
          console.log("Removed Roles:", removedRoles);

          // Yeni roller
          let newRoles = body.roles.filter(x => !userRoles.map(r => r.role_id).includes(x));
          console.log("New Roles:", newRoles);

          // Silme işlemi
          if (removedRoles.length > 0) {
              await UserRoles.deleteMany({ _id: { $in: removedRoles.map(x => x._id.toString()) } });
          }

          // Yeni roller ekleme işlemi
          if (newRoles.length > 0) {
              for (let i = 0; i < newRoles.length; i++) {
                  let userRole = new UserRoles({
                      role_id: newRoles[i],
                      user_id: body._id
                  });
                  await userRole.save();
              }
          }
      }

      // Kullanıcı güncelleme işlemi
      await Users.updateOne({ _id: body._id }, updates);

      res.json(Response.successResponse({ success: true }));
  } catch (err) {
      let errorResponse = Response.errorResponse(err);
      res.status(errorResponse.code || 500).json(errorResponse);
  }
});


/* POST delete user */
router.post('/delete', async (req, res) => {
    let body = req.body;
    try {
        if (!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "_id field must be filled.");

        await Users.deleteOne({ _id: body._id });
        await UserRoles.deleteMany({ user_id: body._id });

        res.json(Response.successResponse({ success: true }));
    } catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code || 500).json(errorResponse);
    }
});

/* POST register */
router.post('/register', async (req, res) => {
    let body = req.body;
    try {
        let user = await Users.findOne({});
        if (user) return res.sendStatus(Enum.HTTP_CODES.NOT_FOUND);

        if (!body.email) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "Email field must be filled.");
        if (is_js.not.email(body.email)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "Invalid email format.");
        if (!body.password) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "Password field must be filled.");
        if (body.password.length < Enum.PASSLENGTH) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", `Password length must be greater than ${Enum.PASSLENGTH}.`);

        let password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8), null);

        let createdUser = await Users.create({
            email: body.email,
            password,
            is_active: true,
            first_name: body.first_name,
            last_name: body.last_name,
            phone_number: body.phone_number
        });

        let role = await Roles.create({
            role_name: Enum.SUPER_ADMIN,
            is_active: true,
            created_by: createdUser._id
        });

        await UserRoles.create({ role_id: role._id, user_id: createdUser._id });

        res.status(Enum.HTTP_CODES.CREATED).json(Response.successResponse({ success: true }, Enum.HTTP_CODES.CREATED));
    } catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code || 500).json(errorResponse);
    }
});

module.exports = router;
