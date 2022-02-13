const Books = require("../models/books")
const fs = require('fs');
const pdfParse = require('pdf-parse');
const User = require('../models/user');

const GridFile = require("../models/uploads");
let  pageNumber  = 0;


const readPdf = async (uri) => {
    const buffer = fs.readFileSync(uri);
    try {
        const data = await pdfParse(buffer);
        console.log('Total pages: ', data.numpages);
        pageNumber = data.numpages
    }catch(err){
        throw new Error(err);
    }
}

// Testing

exports.addBooks =(req,res)=>{
    if(req.file.mimetype !== 'application/pdf'){
        fs.unlinkSync(req.file.path);
        res.status("401").send({message : "Incorrect file"})
    }
    else if(req.query.user === undefined)
       res.status("401").send({message : "Cannot find user"})
    else{
        User.findOne({_id : req.query.user})
        .then(async (user)=> {
            if(!user)
                res.status("401").json({message : "Cannot find user"})
            
            const DUMMY_PDF = './uploads/'+req.file.filename;
            const buffer = fs.readFileSync(DUMMY_PDF);
            try {
                const data = await pdfParse(buffer);
                //console.log('Total pages: ', data.numpages);
                pageNumber = data.numpages
            }catch(err){
                res.status("401").json(err)
            }
            console.log(req.file)
            
            let file = req.file;
            const fileStream = fs.createReadStream(file.path)
            // upload file to gridfs
            const gridFile = new GridFile({ filename: file.filename })
            gridFile.upload(fileStream).then((book)=>{
                // delete the file from local folder
                const saveBook = new Books({
                    filename : book.filename,
                    fs_id : book._id,
                    user_id : req.query.user,
                    status : "UNBLOCKED",
                    path_:DUMMY_PDF,
                    page_number : pageNumber
                });
                saveBook.save()
                    .then(() => res.status('201').json({message : "success"}))
                    .catch(error => res.status('401').json({ error }))
                fs.unlinkSync(file.path); 
                //res.status(201).json(book);

            }).catch((err)=>{
                res.status(401).json(err);
            })
        })
        .catch(err => res.status("401").json({message : "Cannot find user"}))
    }
    
    
}

exports.downloadBook = async(req, res, nxt)=>{
    try {
        const { id, name } = req.params
    
        const gridFile = await GridFile.findById(id)
    
        if (gridFile) {
          res.attachment(name)
          gridFile.downloadStream(res)
        } else {
          // file not found
          res.status(404).json({ error: 'file not found' })
        }
      } catch (err) {
        nxt(err)
      }
}

exports.updateBook = (req,res)=>{
    Books.updateOne({ _id: req.params.id }, {...req.body, _id: req.params.id })
        .then(() => res.status('201').json({ message: "Succesfully updated" }))
        .catch(error => res.status('401').json(error))
}

exports.deleteBook = (req,res)=>{
    Books.deleteOne({ _id: req.params.id })
        .then(() => res.status('201').json({ message: "OK" }))
        .catch(error => res.status('401').json(error))
}

exports.getAllBooks = (req, res, next) => {
    Books.find()
        .then(things => res.status('201').json(things))
        .catch(error => res.status('401').json(error))
}

exports.getSomeBooks = (req, res, next) => {
    Books.find({ user_id: req.params.id })
        .then(things => res.status('201').json(things))
        .catch(error => res.status('401').json(error))
}
exports.getOneBooks = (req, res, next) => {
    Books.findOne({ _id: req.params.id })
        .then(things => res.status('201').json(things))
        .catch(error => res.status('401').json(error))
}

