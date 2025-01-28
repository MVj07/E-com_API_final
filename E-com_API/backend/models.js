const mongoose = require('mongoose');
const AutoValue = require('mongoose-sequence')(mongoose)

const User = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: mongoose.Schema.Types.ObjectId, ref: 'role'},
    createdAt: {type: Date, default: Date.now},
    modifiedAt: {type: Date, default: Date.now}
})
User.plugin(AutoValue, {inc_field: 'id'})

const Role = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    createdAt: {type: Date, default: Date.now},
    modifiedAt: {type: Date, default: Date.now}
});
// Role.plugin(AutoValue, {inc_field: 'id'})

const Product = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number, required: true },
    startDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    freeDelivery: { type: Boolean, default: false },
    deliveryAmount: { type: Number, default: 0 },
    productUrl: { type: String, unique: true, required: true },
    image: [{data: Buffer, contentType: String}],
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    createdAt: {type: Date, default: Date.now},
    modifiedAt: {type: Date, default: Date.now}
})
// Product.plugin(AutoValue, {inc_field: "id"})

const user = mongoose.model('user', User)
const role = mongoose.model('role', Role)
const product = mongoose.model('product', Product)
module.exports = {
    User: user,
    Role: role,
    Product: product
}
// export defaultmodel("staffs",staffSchema)