const express = require("express");
const { _getAllUsers_, _createStaff_, _getAdAllProducts_ } = require("../controllers/admincontroller");
const {authentication} = require('../middlewares/authmiddleware')
const roleCheck = require('../middlewares/rolemiddleware')

const _router_ = express.Router();

// admin: View all users, staff, and vendors
_router_.get("/users", authentication, roleCheck(['admin']), _getAllUsers_);

// admin: create staff
_router_.post("/staff", authentication, roleCheck(['admin']), _createStaff_);

// admin: view all products
_router_.get("/products", authentication, roleCheck(['admin']), _getAdAllProducts_);

module.exports = _router_;
