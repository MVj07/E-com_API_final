const jwt = require('jsonwebtoken')
const {User} = require('../models')

const authentication = (req, res, next)=>{
    try{
        const token = req.headers['authorization']
        if (token){
            jwt.verify(token, process.env.JWT_SECRET, async(err, user)=>{
                if (!err){
                    console.log(user)
                    req.user = await User.findById(user.id).populate('role')
                    next()
                }else {
                    return res.status(403).json({"dt": "Invalid token"})
                }
            })
        }else{
            return res.status(403).json({"dt": "Access denied"})
        }
    }catch(err){
        console.log(err)
        return res.status(500).json({"st": "Something went wrong"})
    }
}
module.exports = {authentication}