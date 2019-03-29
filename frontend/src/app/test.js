var express = require('express');
var bodyParser = require('body-parser');

var hostname = "localhost";
var port = 3000;

var mongoose = require('mongoose');
var options = {
    server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    useNewUrlParser: true
};


var urlmongo = "mongodb+srv://root:root@securiovdb-7dljy.mongodb.net/users"
mongoose.connect(urlmongo, options);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur lors de la connexion'));
db.once('open', function () {
    console.log("Connexion à la base OK");
});

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var myRouter = express.Router();

var userSchema = mongoose.Schema({
    id: String,
    pseudo: String,
    password: String
});

var User = mongoose.model('User', userSchema);

myRouter.route('/users')

    .get(function (req, res) {
        User.find(function (err, users) {
            if (err) {
                res.send(err);
            }
            res.json(users);
        })
    })

    .post(function (req, res) {
        var user = new User();
        user.id = req.body.id;
        user.pseudo = req.body.pseudo;
        user.password = req.body.password;
        user.save(function (err) {
            if (err) {
                res.send(err)
            }
            res.send({ message: 'User ajouté à la DB !' })
        })
    })

    .put(function (req, res) {
        res.json({ message: "Mise à jour d'un user de la DB", methode: req.method })
    })

    .delete(function (req, res) {
        res.json({ message: "Suppression d'un user de la DB", methode: req.method })
    });

myRouter.route('/')

    .all(function (req, res) {
        res.json({
            message: "Bienvenue sur l'API Secur'IoV", methode: req.method
        })
    });


myRouter.route('/users/:user_pseudo')
    .get(function (req, res) {
        User.findOne({pseudo: req.params.user_pseudo}, function (err, user) {
            if (err) {
                res.send(err);
            }
            res.json(user);
        })
    })
    .put(function (req, res) {
        User.findOne({pseudo: req.params.user_pseudo},function(err,user){
            if(err){
                res.send(err)
            }
            else{
                user.id = req.body.id;
                user.pseudo = req.body.pseudo;
                user.password = req.body.password;
                user.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        res.json({ message: 'Mise à jour des données de la Base OK' })
                    }
                })
            }
        })
    })

    .delete(function (req, res) {
        User.findOneAndDelete({pseudo: req.params.user_pseudo},function(err,user){
            if(err){
                res.send(err);
            }
            else{
                res.json({message: "Suppression effectuée de la DB"});
            }
        })
    });


app.use(myRouter);

app.listen(port, hostname, function () {
    console.log("Mon serveur fonctionne sur http://" + hostname + ":" + port + "\n");
});