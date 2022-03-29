const exp = require('express');
const mongoose = require("mongoose")
const app = exp()
const path = require('path')
const serverRoute = require('./routes/serverRoutes')
const userRoute = require("./routes/user")
const bookRoute = require("./routes/books")
const parametersRoute = require("./routes/parameters")
const commandsRoute = require("./routes/commands");
const htmlGenerator = require("./followComands")

const bodyParser = require('body-parser')

//mongodb+srv://rochard_database:<password>@cluster0.0v5yb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
 
mongoose.connect('mongodb+srv://rochard_database:6BE51mKjeL2OCEyO@cluster0.0v5yb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName:"online_printer"
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));
/*
mongoose.connect('mongodb://127.0.0.1:27017/', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName:"online_printer"
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));*/
 
app.use(bodyParser.json())

app.use((req, res, next) => { 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', '*');
    next();
});

//app.use("/api", serverRoute);
app.get("/download", (req,res)=>{
    res.sendFile(path.join(__dirname, "./uploads/"+req.query.book))
}) 

app.use("/user", userRoute);
app.use("/book", bookRoute)
app.use("/utils", parametersRoute);
app.use("/", commandsRoute)

app.use("/get-test", (req, res)=>{
    console.log(req)
   res.status(200).json(req.body);
})

app.get("/follow-command", async (req, res)=>{ 
    console.log(req.rawHeaders[1])
    let myCommand = await htmlGenerator.myHtmlVar(req.query.command)
    if(req.query.command){
        return res.send(myCommand);
    }
    return res.send("Cant found command ID");
    
})

module.exports = app;