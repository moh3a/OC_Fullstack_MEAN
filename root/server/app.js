const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const stuffRoutes = require("./routes/stuffRoutes");
const userRoutes = require("./routes/userRoutes");



/* 
 
CORS headers

*/
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});



app.use(bodyParser.json());



/*

CONNECTING TO THE DB
 
*/
mongoose.connect("mongodb+srv://Cool:linkinpark4ever@things.yttxp.mongodb.net/thingsDB?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch(() => console.log("Not connected to MongoDB !!"));



/*

indique à Express qu'il faut gérer la ressource images de manière statique (un sous-répertoire de notre répertoire de base, __dirname ) à chaque fois qu'elle reçoit une requête vers la route /images

*/
app.use('/images', express.static(path.join(__dirname, 'images')))



/*
 
IMPLEMENTING THE CRUD API
MOVED TO THE ROUTES FOLDER / stuff.js
 
*/
app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes); // implementing the user authentification method

module.exports = app;