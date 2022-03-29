const Books = require("../models/books")
const fs = require('fs');
const pdfParse = require('pdf-parse');
const User = require('../models/user');
const Parameters = require("../models/parameters")

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

exports.addBooks =async (req,res)=>{
    var userID, buyerDetails

    price_per_page = await Parameters.findOne({name : "price_per_page" });
    

    if(req.file.mimetype !== 'application/pdf'){
        fs.unlinkSync(req.file.path);
        res.status("401").send({message : "Incorrect file"})
    }
    else if(req.query.user === undefined){
        fs.unlinkSync(req.file.path);
        res.status("401").send({message : "Cannot find buyer datas"})
    }   
    else{
        console.log("User : "+req.query.user)
        let searchUser = null
        if(req.query.user !== "undefined")
            searchUser = await User.findOne({_id : req.query.user})

        if(searchUser !== null || req.query.user === "undefined") {
            //if(!user)
              //  res.status("401").json({message : "Cannot find user"})
            console.log(req.file);
            //return res.status("401").json(req.file)
            const DUMMY_PDF = './uploads/'+req.file.filename;
            const buffer = fs.readFileSync(DUMMY_PDF); 
            try {
                const data = await pdfParse(buffer);
                //console.log('Total pages: ', data.numpages);
                pageNumber = data.numpages
            }catch(err){
                res.status("401").json(err)
            }
            console.log(req.query)
            
            let file = req.file;
            const fileStream = fs.createReadStream(file.path)
            // upload file to gridfs
            const gridFile = new GridFile({ filename: file.filename })
            gridFile.upload(fileStream).then((book)=>{
                
                const saveBook = new Books({
                    filename : book.filename,
                    fs_id : book._id,
                    user_id : req.query.user,
                    buyer_details : req.query.datas ? JSON.parse(req.query.datas) : {},
                    status : "UNBLOCKED",
                    path_:DUMMY_PDF,
                    page_number : pageNumber
                });
                saveBook.save()
                    .then((result) => res.status('201').json({message : "success", book : result._id, "page_number" : pageNumber, price : price_per_page.value}))
                    .catch(error => res.status('401').json({ error }))

                // delete the file from local folder
                fs.unlinkSync(file.path); 
                //res.status(201).json(book);

            }).catch((err)=>{
                fs.unlinkSync(file.path); 
                res.status(401).json(err);
            })
        }
        else{
            fs.unlinkSync(req.file.path); 
             res.status("401").json({message : "Cannot find user"})
        }
    }
    
    
}

exports.downloadBook = async(req, res, nxt)=>{
    try {
        const id = req.query.id;
        const name = req.query.name;

        console.log(id)
    
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

exports.updateBookStatus = (req,res)=>{
    console.log("launch")
    Books.updateOne({ _id: req.params.id }, {status : req.params.status })
        .then(() => res.status('201').json({ message: "Succes" }))
        .catch(error => res.status('401').json(error))
}

exports.deleteBook = (req,res)=>{
    Books.deleteOne({ _id: req.params.id })
        .then(() => res.status('201').json({ message: "deleted" }))
        .catch(error => res.status('401').json(error))
}

exports.getAllBooks = (req, res, next) => {
    Books.find({status : "UNBLOCKED"})
        .then(things => res.status('201').json(things))
        .catch(error => res.status('401').json(error))
}

exports.getSomeBooks = (req, res, next) => {
    Books.find({ user_id: req.params.id,status : "UNBLOCKED" })
        .then(things => res.status('201').json(things))
        .catch(error => res.status('401').json(error))
}
exports.getOneBooks = (req, res, next) => {
    Books.findOne({ _id: req.params.id })
        .then(things => res.status('201').json(things))
        .catch(error => res.status('401').json(error))
}

