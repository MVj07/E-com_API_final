const {Product} = require("../models");

// admin and vendor: add a Product
const _addProduct_ = async (req, res) => {
    try {
        const { name, description, category, price, oldPrice, startDate, freeDelivery, deliveryAmount } = req.body;
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

        const product = await Product.create({
            name,
            description,
            category,
            price,
            oldPrice,
            vendorId: req.user._id,
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

// user: get all products with pagination ans by search query
const _getAllProducts_ = async (req, res) => {
    try {
        const { page = 1, limit = 5, search = "" } = req.query;
        const _query_ = search? { name: { $regex: search, $options: "i" } } : {};

        const _products_ = await Product.find(_query_).populate("vendorId", "name email").skip((page - 1) * limit).limit(Number(limit));

        const _allProducts_ = _products_.map(item=>{
            const _discountPercentage_=((item.oldPrice-item.price)/item.oldPrice)*100
            const _discountAmount_ = item.oldPrice - item.price
            return {'name':item.name, 
                'decription':item.description,
                'category': item.category,
                'price': item.price,
                'old_price': item.oldPrice,
                'expiry': item.expiryDate,
                'free_delivery': item.freeDelivery,
                'delivery_amount': item.deliveryAmount,
                'vendor_details': item.vendorId,
                'product_url': item.productUrl,
                "discount": _discountPercentage_.toFixed(2),
                "dicount_amount": _discountAmount_.toFixed(2),
                "images": item.image}
        })

        const _totalProducts_ = await Product.countDocuments(_query_);

        res.status(200).json({
            _allProducts_,
            totalPages: Math.ceil(_totalProducts_ / limit),
            currentPage: Number(page),
        });
    } catch (error) {
        res.status(500).json({ "dt": "Error fetching products", "err": error.message });
    }
};

module.exports = { _addProduct_, _getAllProducts_ };
