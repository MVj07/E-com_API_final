const express = require("express");
const {authentication} = require('../middlewares/authmiddleware')
const {_addProduct_, _getVenProduct_} = require('../controllers/staffcontroller')
const roleCheck = require("../middlewares/roleMiddleware");
const upload = require("../utils")

const _router_ = express.Router();

// staff: can create product for assigned vendor
_router_.post("/", authentication, roleCheck(['staff']), upload.array('products'), _addProduct_);
// staff: can view product for assigned vendor
_router_.get("/", authentication, roleCheck(['staff']), _getVenProduct_)

module.exports = _router_