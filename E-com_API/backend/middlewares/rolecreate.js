const _rolecreate_ = (req, res, next) => {
    if (['user', 'vendor'].includes(req.body.role)) {
        next();
    }else{
        return res.status(403).json({ "dt": "Access denied" });
    }
};

module.exports =  _rolecreate_;
