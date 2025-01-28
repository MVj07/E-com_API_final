const multer = require('multer')

// using multer for storage
const storage = multer.memoryStorage();
const upload = multer({storage})

module.exports = upload