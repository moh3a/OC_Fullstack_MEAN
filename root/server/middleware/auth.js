const JWT = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // étant donné que de nombreux problèmes peuvent se produire, nous insérons tout à l'intérieur d'un bloc try...catch
    try {
        // extraire le token du header Authorization de la requête entrante
        const token = req.headers.authorization.split(" ")[1];
        // utiliser ensuite la fonction verify pour décoder notre token. Si celui-ci n'est pas valide, une erreur sera générée
        const decodedToken = JWT.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;

        // si la demande contient un ID utilisateur, compare à celui extrait du token. S'ils sont différents, générer une erreur
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !';
        } else { // dans le cas contraire, tout fonctionne et notre utilisateur est authentifié
            next();
        }
    } catch (error) {
        res.status(401).json({ error : error | "Requête non authentifiée !" })
    }
}