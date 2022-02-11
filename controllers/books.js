const Books = require("../models/books")
const fs = require('fs');
const pdfParse = require('pdf-parse');
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

exports.addBooks =async (req,res)=>{
    if(req.query.user === undefined)
      res.status("401").send({message : "Cannot find user"})
    const DUMMY_PDF = './uploads/'+req.file.filename;
    const buffer = fs.readFileSync(DUMMY_PDF);
    try {
        const data = await pdfParse(buffer);
        console.log('Total pages: ', data.numpages);
        pageNumber = data.numpages
    }catch(err){
        res.status("400").json(err)
    }
    let userId = "949930"
    console.log(req.file)
    const book = new Books({
        filename : req.file.filename,
        user_id : req.query.user,
        status : "UNBLOCKED",
        path_:DUMMY_PDF,
        page_number : pageNumber
    });
    book.save()
        .then(() => res.status('201').json({message : "success"}))
        .catch(error => res.status('400').json({ error }))
}

exports.updateBook = (req,res)=>{
    Books.updateOne({ _id: req.params.id }, {...req.body, _id: req.params.id })
        .then(() => res.status('200').json({ message: "Succesfully updated" }))
        .catch(error => res.status('400').json(error))
}

exports.deleteBook = (req,res)=>{
    Books.deleteOne({ _id: req.params.id })
        .then(() => res.status('200').json({ message: "OK" }))
        .catch(error => res.status('400').json(error))
}

exports.getAllBooks = (req, res, next) => {
    Books.find()
        .then(things => res.status('200').json(things))
        .catch(error => res.status('400').json(error))
}

exports.getSomeBooks = (req, res, next) => {
    Books.find({ user_id: req.params.id })
        .then(things => res.status('200').json(things))
        .catch(error => res.status('400').json(error))
}
exports.getOneBooks = (req, res, next) => {
    Books.findOne({ _id: req.params.id })
        .then(things => res.status('200').json(things))
        .catch(error => res.status('400').json(error))
}

