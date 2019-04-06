const express = require('express');
var async = require('async');
const truffleContract = require('../../connection/app.js');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/users');

//var counter = 2;

router.post('/delete/:id', (req, res, next) => {
    var id = req.params.id;
    var name = req.body.name;

    /*User.find({name: name}).exec().then((result) => {
        console.log(result[0].bcAddress); //It works
    })*/

    User.deleteOne({
        bcId: id //Je peux mettre aussi le nom ou l'@ ip du vehicule
    }).exec().then(async () => {
        await truffleContract.deleteAccount(id).then((response) => {
            res.status(200).json({
                message: 'admin deletes user',
                deletedUser: response
            })
        })
    }).catch(() => {
        res.send(err.message);
    });
});

router.post('/', (req, res, next) => {
    User.find().then(async (result) => {
        console.log(result.length);
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        bcId: result.length + 3,
        name: req.body.name,
        ipAddress: req.body.ip,
        bcAddress: "",
    })

    //console.log(user.name);
    await truffleContract.addAccount(user.ipAddress, user.name).then((response) => {
        truffleContract.renderLastAccount().then(async (result) => {
            user.bcAddress = result;
            //console.log(user);
            user.save().then((result) => {
                //console.log(result);
            
        res.status(200).json({
            message: 'admin adds user',
            createdUser: response
            })
        }).catch((err) => {
            res.send(err.message);
        });
    });
    });
});
});

router.get('/accounts', (req, res, next) => {
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

router.get('/:userId', (req, res, next) => {
    var json =[];
    const id = req.params.userId;

    User.findById(id).exec().then(async (result) => {
        if(result) {
            var info = { account:"", name:"", trustIndex:""}; 
            await truffleContract.renderAccount(result.bcId).then(async (response) => {
                info.account = response;
                //console.log(json);
                await truffleContract.renderName(result.bcId).then(async (response) => {
                    info.name = response;
                    await truffleContract.renderTrustIndex(result.bcId).then((response) => {
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


router.get('/', (req, res, next) => {
    console.log('Getting info from the blockchain');
    truffleContract.renderAdmin().then((answer) => {
        res.status(200).json({
            account: answer
        })
    });

});


module.exports = router;