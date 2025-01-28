const express = require("express");
const { _addProduct_, _getAllProducts_ } = require("../controllers/productcontroller");
const {authentication} = require('../middlewares/authmiddleware')
const roleCheck = require("../middlewares/roleMiddleware");
const upload = require("../utils")

const _router_ = express.Router();

// admin/vendor: add a product
_router_.post("/", authentication, roleCheck(['vendor', 'admin']), upload.array('products'), _addProduct_);

// user: get all products with pagination and search
_router_.get("/", authentication, _getAllProducts_);

module.exports = _router_;
