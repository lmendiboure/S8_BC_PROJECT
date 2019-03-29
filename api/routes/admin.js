const express = require('express');
var async = require('async');
const truffleContract = require('../../connection/app.js');
const router = express.Router();

router.post('/', async (req, res, next) => {
    const user = {
        name: req.body.name
    };
    //console.log(user.name);
    await truffleContract.addAccount("jhkl", user.name).then((response) => {
    res.status(200).json({
        message: 'admin adds user',
        createdUser: response
        })
    }).catch((err) => {
        res.send(err.message);
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
    const id = req.params.userId;
    truffleContract.renderAccount(id).then((result) => {
            console.log(result);
            res.status(200).json({
            accounts : result
        })
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