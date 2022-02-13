const Balance = require("../models/balances");
exports.createBalance = (req, res, next) => {
    const balance = new Balance({
        ...req.body
    });
    balance.save()
        .then(() => res.status('201').json({message : "success"}))
        .catch(error => res.status('401').json({ error }))
};

exports.getOneBalance = (req, res, next) => {
    Balance.findOne({ _id: req.params.id })
        .then(balance => res.status('201').json(balance))
        .catch(error => res.status('401').json(error))
};


exports.updateBalance = (req, res, next) => {
    Balance.updateOne({ _id: req.params.id }, {...req.body, _id: req.params.id })
        .then(() => res.status('201').json({ message: "Succesfully updated" }))
        .catch(error => res.status('401').json(error))


};


exports.deleteBalance = (req, res, next) => {
    Balance.deleteOne({ _id: req.params.id })
        .then(() => res.status('201').json({ message: "OK" }))
        .catch(error => res.status('401').json(error))

}

exports.getAllBalance = (req, res, next) => {

    Balance.find()
        .then(things => res.status('201').json(things))
        .catch(error => res.status('401').json(error))
}