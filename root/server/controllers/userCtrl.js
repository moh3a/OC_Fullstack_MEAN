const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const User = require('../models/User');


/*

SIGN UP - hash the password and create new user from the email and the hashed password

*/
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            // create new user
            const user = new User({
                email: req.body.email,
                password: hash
            });
            // save the new user in db
            user.save()
                .then(() => res.status(201).json({ message : 'utilisateur créé !' }))
                .catch(err => res.status(400).json({ err }));
        })
        .catch(err => res.status(500).json({ err }));
};



/*

LOG IN - verify the email and compare the entered password with the hashed password in the db

*/
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            // on vérifie d'abord que l email fournit existe dans notre db
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé' });
            }

            // compare the hashed passwords
            bcrypt.compare(req.body.password, user.password)
                .then(valid => { // typeof valid is a boolean
                    // verify that the password is valid
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: JWT.sign( // pour encoder un nouveau token
                            { userId: user._id }, //contient l'ID de l'utilisateur en tant que payload
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(err => res.status(500).json({ err }))
        })
        .catch(err => res.status(500).json({ err }));
};