const multer = require("multer")
const path = require('path')


const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb)=>{
         cb(null, "./uploads")  
    },
    filename:(req, file, cb)=>{
      const name = file.originalname.split(' ').join('_');
      //console.log(file)
      cb(null, Date.now()+"--"+name)
    },
    
})

exports.upload = multer({storage : fileStorageEngine} )