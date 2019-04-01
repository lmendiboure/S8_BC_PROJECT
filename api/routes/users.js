const express = require('express');
const truffleContract = require('../../connection/app.js');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /users'
    });
});

router.post('/', (req, res, next) => {
    const userAddr = { /*li an9ssu lih trustIndex*/
        userId: req.body.userId
    };
    res.status(201).json({
        message: 'Handling POST requests to /users',
        userId, userAddr
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

router.patch('/:userId', (req, res, next) => {
    res.status(200).json({
        message: 'updated user'
    });
});

module.exports = router;