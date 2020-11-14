const multer = require('multer');

const MIME_TYPES = {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg',
    'image/png' : 'png'
}

// contient la logique nécessaire pour indiquer à multer où enregistrer les fichiers entrants
const storage = multer.diskStorage({

    destination: (req, file, callback) => {
        // destination indique à multer d'enregistrer les fichiers dans le dossier images
        callback(null, 'images')
    },


    filename: (req, file, callback) => {
        //  indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now() comme nom de fichier
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];

        callback(null, name + Date.now() + '.' + extension)
    }

});

module.exports = multer({storage}).single('image');