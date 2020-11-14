const Thing = require("../models/Thing");
const fs = require('fs');



exports.createThing = (req, res, next) => {
    // Le corps de la requête contient une chaîne thing , qui est simplement un objet Thing converti en chaîne. Nous devons donc l'analyser à l'aide de JSON.parse() pour obtenir un objet utilisable

    const thingObject = JSON.parse(req.body.thing);

    delete thingObject._id; // DELETE THE WRONG _id sent by the frontend form
    const thing = new Thing({
        ...thingObject,
        // Nous utilisons req.protocol pour obtenir le premier segment (dans notre cas 'http' ). Nous ajoutons '://' , puis utilisons req.get('host') pour résoudre l'hôte du serveur (ici, 'localhost:3000' ). Nous ajoutons finalement '/images/' et le nom de fichier pour compléter notre URL.
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    thing.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
}



exports.modifyThing = (req, res, next) => {
    // on crée un objet thingObject qui regarde si req.file existe ou non. S'il existe, on traite la nouvelle image ; s'il n'existe pas, on traite simplement l'objet entrant
    const thingObject = req.file ? 
        {
            ...JSON.parse(req.body.thing),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    // On crée ensuite une instance Thing à partir de thingObject , puis on effectue la modification
    Thing.updateOne({_id: req.params.id}, {...thingObject, _id : req.params.id})
        .then(() => res.status(200).json({ message : 'Objet modifié !' }))
        .catch(err => res.status(400).json({ err }));
}



exports.deleteThing = (req, res, next)=> {
    Thing.findOne({ _id: req.params.id })
        .then(thing => {
            // nous utilisons le fait de savoir que notre URL d'image contient un segment /images/ pour séparer le nom de fichier
            const filename = thing.imageUrl.split('/images/')[1];
            // nous utilisons ensuite la fonction unlink du package fs pour supprimer ce fichier, en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé 
            fs.unlink(`images/${filename}`, () => {
                Thing.deleteOne({ _id : req.params.id })
                    .then(() => res.status(200).json({ message : 'Objet supprimé !' }))
                    .catch(err => res.status(400).json({ err }));
            })
        })
        .catch(err => res.status(500).json({ err }))
}



exports.getOneThing = (req, res, next) => { // GET ONE ITEM BY :id
    Thing.findOne({ _id: req.params.id })
      .then(thing => res.status(200).json(thing))
      .catch(error => res.status(404).json({ error }));
}



exports.getAllStuff = (req, res, next) => { // GET EVERYTHING
    Thing.find()
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({ error }));
}