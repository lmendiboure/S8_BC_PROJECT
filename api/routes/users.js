const express = require('express');
const truffleContract = require('../../connection/app.js');
var async = require('async');
const router = express.Router();
const bcrypt = require('bcrypt');
var Hashids = require('hashids');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
var hashids = new Hashids('', 10);

const mongoose = require('mongoose');

const User = require('../models/users');


router.post("/login", (req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if (user.length < 1) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Auth failed"
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                email: user[0].email,
                userId: user[0]._id,
                blockAddress : user[0].bcAddress
              },
              process.env.JWT_KEY,
              {
                  expiresIn: "1h"
              }
            );
            return res.status(200).json({
              message: "Auth successful",
              token: token
            });
          }
          res.status(401).json({
            message: "Auth failed"
          });
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

  //router.use(checkAuth);

router.patch('/signup/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.find({email: req.body.email})
    .exec()
    .then((user) => {
        if(user.length > 1) {
            return res.status(409).json({
                message: 'Mail already exists'
            });
        } else {
            const updateOps = {};
            for (const ops of req.body) {
                updateOps[ops.propName] = ops.value;
                if(ops.propName == "password") {
                    bcrypt.hash(updateOps.password, 10, (err, hash) => {
                        if(err) {
                            return res.status(500).json({
                                error: err
                            });
                        } else {
                            updateOps[ops.propName] = hash;
                            User.update({_id: id}, {$set: updateOps})
                            .exec()
                            .then((result) => {
                                console.log(result);
                                res.status(200).json(result);
                            })
                            .catch((err) => {
                                console.log(err);
                                res.status(500).json({
                                    error : err
                                })
                            });
                        }
                    });
                }
            }
        }
    })
});

router.get('/accounts', checkAuth, (req, res, next) => {
    console.log('getting accounts information');
    //console.log(req.query.account);
    //var query = req.query.account;
    //console.log(query);
    var json =[];
    truffleContract.renderAllAccounts().then(async (i) => {
        i = i;
        for(let j = 1; j <= i; j++) {
            var info = { account:"", name:"", trustIndex:""}; 
            await truffleContract.renderAccount(j).then(async (response) => {
                info.account = response;
                //console.log(json);
                await truffleContract.renderName(j).then(async (response) => {
                    info.name = response;
                    await truffleContract.renderTrustIndex(j).then((response) => {
                        info.trustIndex = response.toNumber();
                        json.push(info);
                        return json;
                    });
                });      
            }).catch((err) => {
                send(err.message);
            })
        }
        res.status(200).send(json);
    });
});

router.get('/:userId', checkAuth, (req, res, next) => {
    var json =[];
    const id = req.params.userId;

    User.findById(id).exec().then(async (result) => {
        if(result) {
            blockId = hashids.decode(result.bcId)
            var info = { account:"", name:"", trustIndex:""}; 
            await truffleContract.renderAccount(blockId).then(async (response) => {
                info.account = response;
                //console.log(json);
                await truffleContract.renderName(blockId).then(async (response) => {
                    info.name = response;
                    await truffleContract.renderTrustIndex(blockId).then((response) => {
                        info.trustIndex = response.toNumber();
                        json.push(info);
                        return json;
                    }).then((result) => {
                        res.status(200).send(json);
                    });
                });
            });
        } else {
            res.status(404).json({
                message : 'No valid entry for provided ID'
            });
        }
       
        }).catch((err) => {
            res.status(500).send(err);
    });
});

router.get('/', checkAuth, (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /users'
    });
});

router.post('/', checkAuth, (req, res, next) => {
    //on peut faire en sorte que l'identifiant d'un utilisateur soit son adresse IP
    const userAddr = { /*li an9ssu lih trustIndex*/
        userId: req.body.userId
    };
    res.status(201).json({
        message: 'Handling POST requests to /users',
        userId, userAddr
    });
});

module.exports = router;