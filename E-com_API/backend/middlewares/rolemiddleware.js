const roleCheck = (roles) => {
    return (req, res, next) => {
        console.log(req.user.role.name)
        if (!roles.includes(req.user.role.name)) {
            return res.status(403).json({ message: "Access forbidden" });
        }
        next();
    };
};

module.exports = roleCheck;
