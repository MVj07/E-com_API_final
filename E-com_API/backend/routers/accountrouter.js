const express = require("express");
const { _signup_, _login_ } = require("../controllers/accountcontroller");
const _rolecreate_ = require('../middlewares/rolecreate')
const _router_ = express.Router();

// users signup (vendor, user)
_router_.post('/signup', _rolecreate_, _signup_)
// users login (vendor, admin, staff, user)
_router_.post('/login', _login_)

module.exports = _router_;
