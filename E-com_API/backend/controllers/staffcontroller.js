const {User, Product} = require("../models");

// staff: add a product
const _addProduct_ = async (req, res) => {
    try {
        const { name, description, category, price, oldPrice, startDate, freeDelivery, deliveryAmount, vendor } = req.body;
        // calculate expiry date
        const expiryDate = new Date(startDate);
        expiryDate.setDate(expiryDate.getDate() + 7);

        // handling image uploads
        const _images_ = req.files.map(image=>({
            data: image.buffer,
            contentType: image.mimetype
        }))

        // generate a unique URL for the product
        const productUrl = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;

        const user=await User.findOne({email: vendor}).populate('role', 'name')
        if (user && user.role.name==='vendor'){
            var _vendorId_ = user._id
        }else{
            res.status(500).json({"dt": "Account not found"})
        }
        
        const product = await Product.create({
            name,
            description,
            category,
            price,
            oldPrice,
            vendorId: _vendorId_,
            startDate,
            expiryDate,
            freeDelivery,
            deliveryAmount,
            productUrl,
            image: _images_
        });

        res.status(201).json({ message: "Product added successfully", product });
    } catch (error) {
        res.status(500).json({ message: "Error adding product", "err": error.message });
    }
};

// staff: get all products for assigned vendors with pagination and search query
const _getVenProduct_=async(req, res)=>{
    try {
        const {vendor, search="", page=1, limit=5} = req.query
        const _query_ = search? { name: { $regex: search, $options: "i" } }: {};
        const user = await User.findOne({email: vendor}).populate('role', 'name')
        if (user && user.role.name==='vendor'){

            const products = await Product.find({vendorId: user._id, ..._query_}).populate('vendorId', 'name email').skip((page - 1) * limit).limit(Number(limit));
            const _totalProducts_ = await Product.countDocuments({vendorId:user._id, ..._query_});
            
            res.status(200).json({
                products, 
                totalPages: Math.ceil(_totalProducts_ / limit),
                currentPage: Number(page),})
        } else {
            res.status(404).json({'dt': 'User is not vendor'})
        }
    }catch (err){
        res.status(500).json({'dt': 'Error fetching data', 'err': err.message})
    }
}

module.exports = {_addProduct_, _getVenProduct_}