const {User, Role} = require('../models')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const _signup_=async(req, res)=>{
    try{
        const {uname, mail, pass, role} = req.body
        if (uname && mail && pass && role){
            const _exuser_ = await User.findOne({ email: mail })

            if (!_exuser_){
                let _roleid_ = await Role.findOne({name: role})
                if (!_roleid_){
                    return res.status(404).json({'dt': 'Something went wrong'})
                }

                // password encryption
                const _hashpass_ = await bcrypt.hash(pass, 10)

                const _newacc_ = new User({username: uname, email: mail, password: _hashpass_, role: _roleid_._id})
                await _newacc_.save()
                res.status(201).json({'dt': 'Account created successfully'})
            }else{
                res.status(404).json({'dt': 'User already exists'})
            }
        }
        else{
            res.status(500).json({'dt': 'One of the credential were not provided'})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({'dt': 'Something went wrong'})
    }
}

const _login_=async(req, res)=>{
    try{
        const {email, pass} = req.body
        console.log(req.body)
        if (email && pass){
            const _user_ = await User.findOne({email: email})
            if (_user_){
                let _passmatch_ = await bcrypt.compare(pass, _user_.password)
                if (_passmatch_){
                    // checking jwt access token
                    let _token_ = jwt.sign({id: _user_._id, role: _user_.role.name}, process.env.JWT_SECRET, {expiresIn: '1hr'})
                    return res.status(200).json({'dt': _token_})
                } else {
                    return res.status(404).json({'dt': 'Invalid email or password'})        
                }
            }
            return res.status(404).json({'dt': 'Account not found!'})
        } else {
            res.status(404).json({'dt': 'One of the credential were not provided'})
        }
    } catch (err){
        console.log(err)
        res.status(500).json({'dt': 'Something went wrong'})
    }
}

module.exports = {_signup_,_login_}
