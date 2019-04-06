const express = require('express');
const truffleContract = require('../../connection/app.js');
const router = express.Router();

const mongoose = require('mongoose');

const User = require('../models/users');

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /users'
    });
});

router.post('/', (req, res, next) => {
    //on peut faire en sorte que l'identifiant d'un utilisateur soit son adresse IP
    const userAddr = { /*li an9ssu lih trustIndex*/
        userId: req.body.userId
    };
    res.status(201).json({
        message: 'Handling POST requests to /users',
        userId, userAddr
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


router.patch('/:userId', (req, res, next) => {
    res.status(200).json({
        message: 'updated user'
    });
});

module.exports = router;