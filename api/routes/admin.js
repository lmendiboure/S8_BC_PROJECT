const express = require('express');
var async = require('async');
const truffleContract = require('../../connection/app.js');
const router = express.Router();

router.post('/delete/:id', async (req, res, next) => {
    const user = {
        name: req.body.name,
        ip: req.body.ip
    };
    //console.log(user.name);
    var id = req.params.id;
    await truffleContract.deleteAccount(id).then((response) => {
        res.status(200).json({
            message: 'admin deletes user',
            deletedUser: response
            })
        }).catch((err) => {
            res.send(err.message);
        });
})

router.post('/', async (req, res, next) => {
    const user = {
        name: req.body.name,
        ip: req.body.ip
    };
    //console.log(user.name);
    await truffleContract.addAccount(user.ip, user.name).then((response) => {
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

router.get('/:userId', async (req, res, next) => {
    var json =[];
    const id = req.params.userId;
    var info = { account:"", name:"", trustIndex:""}; 
            await truffleContract.renderAccount(id).then(async (response) => {
                info.account = response;
                //console.log(json);
                await truffleContract.renderName(id).then(async (response) => {
                    info.name = response;
                    await truffleContract.renderTrustIndex(id).then((response) => {
                        info.trustIndex = response.toNumber();
                        json.push(info);
                        return json;
                    });
                });      
            }).catch((err) => {
                send(err.message);
            })
        res.status(200).send(json);
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