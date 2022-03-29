const Parameters = require("../models/parameters");




exports.addParameters = (req, res)=>{
      const parameters = new Parameters({
          name : req.body.name,
          value :req.body.value
      })

      parameters.save()
        .then((parameters)=>{
            res.status("201").json(parameters)
        })
        .catch((err)=>{
             res.status("401").json(err)
        })
}


exports.updateParameter = (req, res)=>{
     Parameters.updateOne({_id : req.params.id}, {...req.body, _id:req.params.id })
        .then(()=>{
            res.status("201").json({message : "Succes"})
        })
        .catch((err)=>{
            res.status("401").json(err)
        })
}

exports.getparameter = (req, res)=>{
   
        Parameters.find()
        .then(parameters => res.status("201").json(parameters))
        .catch(err => res.status("401").json(err))


}

exports.getoneparameter = (req, res)=>{
    Parameters.findOne({name : req.params.name})
    .then(parameters => res.status("201").json(parameters))
    .catch(err => res.status("401").json(err))

}