const Commands = require("../models/commands");
const Parameters = require("../models/parameters");
const Books = require("../models/books")
const Transaction = require("../models/transaction")
const Pending = require("../models/pendings")
const dotenv = require("dotenv");
const mailSender = require("../mailer");
const htmlGenerator = require("../htmlGenerator")

dotenv.config()
const stripe = require('stripe')(process.env.STRIPE_TOKEN);
// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.

exports.makeCommand = async(req, res)=>{
    let verifyCommand 
    try {
        verifyCommand = await Commands.find({book_id:req.body.book})
        if(verifyCommand.length > 0)
             return res.status(401).send("Command already exist")
    } catch (error) {
        console.log(error)
    }

   
    //return res.status(400).send(req.body)

    let book_pages, price_per_page, user, book_name;
    Books.findOne({ _id:req.body.book})
        .then(things => {
            //return res.status(400).send(things)
            book_pages = things.page_number
            user = things.user_id
            book_name = things.filename.split("--")
            console.log("Page Number : "+book_pages);
            Parameters.findOne({name : "price_per_page" })
            .then(async (parameters) => {
                let p = new Pending({
                    user_id:user,
                    book:req.body.book,
                    type:req.body.type,
                    price_per_page:parameters.value,
                    pages : book_pages,
                    address : req.body.address
                })

                let pending = await p.save()
               // return res.status(400).send(p)
                price_per_page = parameters.value
                console.log("Price per page : "+price_per_page)
                const session = await stripe.checkout.sessions.create({
                    line_items: [
                      {
                        price_data: {
                          currency: 'eur',
                          product_data: {
                            name: book_name[1],
                          },
                          unit_amount:parseFloat(book_pages)*parseFloat(price_per_page)*100,
                        },  
                        quantity: 1,
                      },
                    ], 
                    mode: 'payment',
                    success_url: req.body.callback_url+'&pending='+pending._id,
                    cancel_url: req.body.callback_url+'&status=cancel'+"&pending="+pending._id,
                  });
                
                  //res.redirect(303, session.url);
                  res.status(200).json(session)
                
            })
            .catch(err => res.status("401").json(err))
        })
        .catch(error => res.status('400').json(error))
    console.log(req.body.book)
    
}

exports.executeCommand =  async (req, res) => {

    if(req.query.status !== undefined && req.query.pending !== undefined){
        await Pending.deleteOne({_id : req.query.pending})
        return res.status(201).json({message : "operation canceled"})
    }

    if(req.query.session === undefined)
      return res.status(401).json({message : "no session"})

    
    const session = await stripe.checkout.sessions.retrieve(req.query.session);
   

    let pending = await Pending.findOne({_id : req.query.pending})

    if(!pending){
        return res.status("201").json({message : "Transaction already payd or not exist"})
    }
     
    const tr = new Transaction({
        user_id : pending.user_id,
        status:session.payment_status,
        book_id:pending.book,
        amount:parseFloat(session.amount_total)/100,
        method :"STRIPE",
        payment_id:session.id,
    })
    tr.save().then(async(tr)=>{
        if(session.payment_status==="paid"){
            const command = new Commands({
                user_id : pending.user_id,
                book_id : pending.book,
                type : pending.type,
                price_per_page:pending.price_per_page,
                page_number:parseInt(pending.pages),
                transaction_id:tr.id,
                status : "Order Completed",
                address:{
                    country : pending.address.country,
                    city : pending.address.city,
                    street: pending.address.street,
                    number: pending.address.number,
                    zip_code: pending.address.zip_code,
                }
            })
            command.save().then(async(result)=>{
                
                if(pending.user_id !== "undefined"){
                    await Pending.deleteOne({_id : req.query.pending})
                    return res.status("201").json({message : "Succes"})
                }
                    
                else{
                    await Pending.deleteOne({_id : req.query.pending})
                    let getBook = await Books.findOne({_id : result.book_id})
                    if(getBook !== null){
                        let response = mailSender.transporter(getBook.buyer_details.email, "Commandeur : "+getBook.buyer_details.lastname+" "+getBook.buyer_details.firsnamt, htmlGenerator.htmlGenerator(getBook.filename.split("--")[1], null, "http://"+req.rawHeaders[1]+"/follow-command?command="+result._id))
                        return res.status("201").json({message: "void", url : "http://"+req.rawHeaders[1]+"/follow-command?command="+result._id})
                    }
                    
                }
                    
            }).catch((err)=>{
                return res.status("401").json({message : "Saving Commmand error", error: err})
            })
        }else{
            await Pending.deleteOne({_id : req.query.pending})

            return res.status("401").json({message : "Transaction fail"})
        }
         
    }).catch(()=>{
        return res.status("401").json({message : "Saving Transaction Error"})
    })

    //res.send(session);
  }


exports.getCommands = (req, res)=>{ 
   Commands.find()
    .then(commands => res.status("201").json(commands))
    .catch(err => res.status("401").json(err))
}

exports.getSomeCommands = (req, res)=>{ 
    Commands.find({user_id:req.params.id})
     .then(commands => res.status("201").json(commands))
     .catch(err => res.status("401").json(err))
 }
 
 exports.getOneCommand = (req, res)=>{
    Commands.findOne({book_id : req.params.id})
      .then(command => res.status("200").json(command))
      .catch(err => res.status("401").json(err))
  }

exports.getTransactions = (req, res)=>{ 
    Transaction.find()
     .then(tr => res.status("201").json(tr))
     .catch(err => res.status("401").json(err))
 }

1

exports.updateCommand = (req, res)=>{
    Commands.updateOne({_id : req.params.id}, {status:req.body.status})
       .then(()=>{
           res.status("201").json({message : "Succes"})
       })
       .catch((err)=>{
           res.status("401").json(err)
       })
}