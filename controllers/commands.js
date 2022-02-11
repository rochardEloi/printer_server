const Commands = require("../models/commands");
const Parameters = require("../models/parameters");
const Books = require("../models/books")
const Transaction = require("../models/transaction")
const dotenv = require("dotenv");
const { toInteger } = require("lodash");
dotenv.config()
const stripe = require('stripe')(process.env.STRIPE_TOKEN);
// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.
exports.makeCommand = async(req, res)=>{
    let book_page, price_per_page, user;
    Books.findOne({ _id:req.body.book})
        .then(things => {
            book_page = things.page_number
            user = things.user_id
            console.log("Page Number : "+book_page);
            Parameters.findOne({name : "price_per_page" })
            .then(async (parameters) => {
                console
                price_per_page = parameters.value
                console.log("Price per page : "+price_per_page)
                const session = await stripe.checkout.sessions.create({
                    line_items: [
                      {
                        price_data: {
                          currency: 'usd',
                          product_data: {
                            name: 'T-shirt',
                          },
                          unit_amount:parseFloat(book_page)*parseFloat(price_per_page)*100,
                        },  
                        quantity: 1,
                      },
                    ], 
                    mode: 'payment',
                    success_url: req.body.callback_url+'&book='+req.body.book+"&type="+req.body.type+"&price="+price_per_page+"&page="+book_page+"&user="+user,
                    cancel_url: req.body.callback_url+'&book='+req.body.book+"&type="+req.body.type,
                  });
                
                  //res.redirect(303, session.url);
                  res.send(session)
                
            })
            .catch(err => res.status("401").json(err))
        })
        .catch(error => res.status('400').json(error))
    console.log(req.body.book)
    
}

exports.executeCommand =  async (req, res) => {
    const session = await stripe.checkout.sessions.retrieve(req.query.session);

    const tr = new Transaction({
        user_id : req.query.user,
        status:session.payment_status,
        book_id:req.query.book,
        amount:parseFloat(session.amount_total)/100,
        method :"STRIPE",
        payment_id:session.id,
    })
    tr.save().then((tr)=>{
        if(session.payment_status==="paid"){
            const command = new Commands({
                user_id : req.query.user,
                book_id : req.query.book,
                type : req.query.type,
                price_per_page:parseInt(req.query.price),
                page_number:parseInt(req.query.page),
                transaction_id:tr.id,
                status : "Commande Effectuer"
            })
            command.save().then(()=>{
                res.status("200").json({message : "Succes"})
            }).catch((err)=>{
                res.status("400").json({message : "Saving Commmand error", error: err})
            })
        }else
         res.status("400").json({message : "Transaction fail"})
    }).catch(()=>{
        res.status("400").json({message : "Saving Transaction Error"})
    })

    //res.send(session);
  }


exports.getCommands = (req, res)=>{ 
   Commands.find()
    .then(commands => res.status("200").json(commands))
    .catch(err => res.status("401").json(err))
}

exports.getSomeCommands = (req, res)=>{ 
    Commands.find({user_id:req.params.id})
     .then(commands => res.status("200").json(commands))
     .catch(err => res.status("401").json(err))
 }
 

exports.getTransactions = (req, res)=>{ 
    Transaction.find()
     .then(tr => res.status("200").json(tr))
     .catch(err => res.status("401").json(err))
 }

exports.getOneCommand = (req, res)=>{
  Commands.findOne({_id : req.params.id})
    .then(command => res.status("200").json(command))
    .catch(err => res.status("401").json(err))
}

exports.updateCommand = (req, res)=>{
    Commands.updateOne({_id : req.params.id}, {status:req.body.status})
       .then(()=>{
           res.status("200").json({message : "Succes"})
       })
       .catch((err)=>{
           res.status("401").json(err)
       })
}