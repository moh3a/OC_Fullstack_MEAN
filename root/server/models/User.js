const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const User = mongoose.Schema({
    email : {type: String, required: true, unique: true},
    password : {type: String, required: true}
})

// Dans notre schéma, la valeur unique , avec l'élément mongoose-unique-validator passé comme plug-in, s'assurera qu'aucun des deux utilisateurs ne peut partager la même adresse e-mail
User.plugin(uniqueValidator)

module.exports = mongoose.model("User", User);