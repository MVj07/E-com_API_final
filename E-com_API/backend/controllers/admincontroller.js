const {User, Role, Product} = require('../models')
const bcrypt = require('bcrypt');

// admin: view all users, staff, and vendors with pagination and search query
const _getAllUsers_ = async (req, res) => {
    const {search="", page=1, limit=5} = req.query
    try {
        const _query_ = search? { username: { $regex: search, $options: "i" } }: {};
        const users = await User.find(_query_).populate("role", "name email").skip((page - 1) * limit).limit(Number(limit));
        const _totalUsers_ = await User.countDocuments(_query_)
        res.status(200).json({
            users,
            totalPages: Math.ceil(_totalUsers_ / limit),
            currentPage: Number(page)
        });
    } catch (error) {
        res.status(500).json({ "dt": "Error fetching users", "err": error.message });
    }
};

// admin: create staff
const _createStaff_ = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ "dt": "Staff member already exists" });
        }
        let _roleid_ = await Role.findOne({name: 'staff'})
        
        // password encryption
        const _hashpass_ = await bcrypt.hash(password, 10)
        const staff = await User.create({ username, email, password: _hashpass_, role: _roleid_._id });
        res.status(201).json({ "dt": "Staff created successfully", staff });
    } catch (error) {
        res.status(500).json({ "dt": "Error creating staff", "err": error.message });
    }
};

// admin: view all products with pagination and by searc query
const _getAdAllProducts_ = async(req, res)=> {
    try {
        const { page = 1, limit = 5, search = "" } = req.query;
        const _query_ = search? { name: { $regex: search, $options: "i" } }: {};

        const _products_ = await Product.find(_query_)
            .populate("vendorId", "name email") 
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const _totalProducts_ = await Product.countDocuments(_query_);

        res.status(200).json({
            _products_,
            totalPages: Math.ceil(_totalProducts_ / limit),
            currentPage: Number(page),
        });
    } catch (error) {
        res.status(500).json({ "dt": "Error fetching products", "err": error.message });
    }
};

module.exports = {_getAllUsers_, _createStaff_, _getAdAllProducts_}