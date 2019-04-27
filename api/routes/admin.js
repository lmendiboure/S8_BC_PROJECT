const express = require('express');
var async = require('async');
const truffleContract = require('../../connection/app.js');
const router = express.Router();
const mongoose = require('mongoose');
var Hashids = require('hashids');
var hashids = new Hashids('', 10);

const User = require('../models/users');


router.post('/delete', (req, res, next) => {
    var id;
    var name = req.body.name;

    User.find({name: name}).exec().then((result) => {
        console.log(result[0].bcAddress);
        id =  hashids.decode(result[0].bcAddress)//It works
    })

    User.deleteOne({
        name: name //Je peux mettre aussi le nom ou l'@ ip du vehicule
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
    var identifiant;
    User.find({name: req.body.name})
    .exec()
    .then((name) => {
        if(name.length >= 1) {
            return res.status(409).json({
                message: 'name already exists'
            });
        } else {
            User.find().then(async (result) => {
                console.log(result.length);
                var id = hashids.encode(result.length);
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                bcId: id,
                name: req.body.name,
                ipAddress: req.body.ip,
                bcAddress: "",
            })
            //console.log('hash id ' + user.bcId);
            identifiant=user._id;
            //console.log(user.name);
            await truffleContract.addAccount(user.ipAddress, user.name).then((response) => {
                truffleContract.renderLastAccount().then(async (result) => {
                    user.bcAddress = result;
                    //console.log(user);
                    user.save().then((result) => {
                        //console.log(result);

                    res.status(200).json({
                        message: 'admin adds user',
                        identifiant: identifiant,
                        createdUser: response
                    })
                }).catch((err) => {
                    res.send(err.message);
                });
                });
                });
            });
        }
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
            var info = { account:"", name:"", trustIndex:"", ip:""};
 		await truffleContract.renderAccount(j).then(async (response) => {
                info.account = response;
                await truffleContract.renderName(j).then(async (response) => {
                    info.name = response;
                    await truffleContract.renderTrustIndex(j).then(async (response) => {
                        info.trustIndex = response.toNumber();
				//console.log(info);
			  await truffleContract.renderAddressIP(j).then((response) => {
					//console.log(info);
					info.ip=response;
					//console.log(info.ip);
				        json.push(info);
				        return json;

			});
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
            blockId = hashids.decode(result.bcId) +1;
            //console.log('hello ' + hashids.decode(result.bcId));
            var info = { account:"", name:"", trustIndex:"", ip:""};
            await truffleContract.renderAccount(blockId).then(async (response) => {
                info.account = response;
                //console.log(json);
                await truffleContract.renderName(blockId).then(async (response) => {
                    info.name = response;
                    await truffleContract.renderTrustIndex(blockId).then(async(response) => {
                        info.trustIndex = response.toNumber();
			await truffleContract.renderAddressIP(blockId).then((response) => {
					//console.log(info);
					info.ip=response;
                        		json.push(info);
                        		return json;
                    }).then((result) => {
                        res.status(200).send(json);
                    });
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

router.post('/change', (req, res, next) => {
    var ipx = req.body.ipx;
    var ipy = req.body.ipy;
    var value = req.body.value;
    var idx,idy;

    User.find({ipAddress: ipx}).exec().then((result) => {
	if(result.length == 0) {
		    	return res.status(409).json({
		        message: 'IP does not exist in database'
		    		});}
       // console.log(result[0].bcAddress);
        idx =  Number(hashids.decode(result[0].bcId))+1 //It works
        console.log(idx);
    })

    User.find({ipAddress: ipy}).exec().then( async (result) => {
	if(result.length == 0) {
		    	return res.status(409).json({
		        message: 'IP does not exist in database'
		    		});}
        
        idy =  Number(hashids.decode(result[0].bcId))+1 //It works
	console.log(idy);

	 await truffleContract.changerights(idx,idy,value).then((response) => {
			    res.status(200).json({
				message: 'admin changes send rights '
		    }).catch(() => {
			res.send(err.message);
		    });
		});

    })

   
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
