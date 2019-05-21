const express = require('express');
var async = require('async');
const truffleContract = require('../../connection/app.js');
const router = express.Router();
const mongoose = require('mongoose');
var Hashids = require('hashids');
var hashids = new Hashids('', 10);

const User = require('../models/users');
const Report = require('../models/report');
const Group = require('../models/groups');


const TrustIndex = () => {
    var id;
    User.find()
    .exec()
    .then(async result => {
        for(let i = 0; i < result.length; i++) {
            id = Number(hashids.decode(result[i].bcId)) + 1;
            var ti;
            console.log(result[i].bcId)
            await truffleContract.renderTrustIndex(id).then((response) => {
                console.log(response.toNumber())
                if(response.toNumber() < 2) {
                    increaseTrustIndex(id);
                }
            })
        }
    })
}

const increaseTrustIndex = async (index) => {
    await truffleContract.increaseTrustIndex(index).then(response => {
        return res.status(200).json({
            message: "trust index increased",
            result: response
        })
    }).catch(e => {
        return res.status(404).json({
            error: e
        })
    })
}

setInterval(TrustIndex, 5 * 1000);

router.delete('/reports/:reportId', (req, res, next) => {
    var id = req.params.reportId;
    console.log(id);
    Report.deleteOne({
        _id: id
    })
    .exec()
    .then((response) => {
        console.log(response);
        //console.log(result);
        res.status(200).json({
            message: 'Signalement supprimé',
            response: response
        })
    }).catch((err) => {
        res.send(err.message);
    });
});

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
			  await truffleContract.renderAddressIP(j).then(async (response) => {
					//console.log(info);
					info.ip=response;
					//console.log(info.ip);
                        json.push(info);
                        await truffleContract.renderImmatriculation(j).then((response) => {
                            info.immatriculation = response;
                            return json;
                        });

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

router.post('/change', (req, res, next) => {
    var ipx = req.body.ipx;
    var ipy = req.body.ipy;
    var value = req.body.value;
    var idx,idy;

    User.find({ipAddress: ipx}).exec().then(async (result) => {
	if(result.length == 0) {
		    	return res.status(409).json({
		        message: 'IP does not exist in database'
		    		});}
       // console.log(result[0].bcAddress);
        idx =  Number(hashids.decode(result[0].bcId))+1 //It works
        console.log(idx);
    

    await User.find({ipAddress: ipy}).exec().then(async (result) => {
	if(result.length == 0) {
		    	return res.status(409).json({
		        message: 'IP does not exist in database'
		    })
	} else {
		idy =  Number(hashids.decode(result[0].bcId))+1 //It works
		console.log(idy);
		console.log(value);
		await truffleContract.changerights(idx,idy,value).then((response) => {
			    return res.status(200).json({
				message: 'admin changes send rights'
		    })
		})
		}
    	})
	}).catch((err) => {
			console.log(err);
		    });
});



router.get('/reports', (req, res, next) => {
    Report.find().then((response) => {
        console.log(response);
        //console.log(result);
        res.status(200).json({
            message: 'Liste des signalements',
            response: response
        })
    }).catch((err) => {
        res.send(err.message);
    });
});

router.get('/groupes', (req, res, next) => {
    Group.find().then((response) => {
        console.log(response);
        res.status(200).json({
            message: 'Liste des groupes',
            response: response
        })
    }).catch((err) => {
        res.send(err.message);
    });
});

router.get('/:userId', (req, res, next) => {
    var json =[];
    const id = req.params.userId;

    User.findById(id).exec().then(async (result) => {
        if(result) {
            blockId = hashids.decode(result.bcId) +1;
            //console.log('hello ' + hashids.decode(result.bcId));
            var info = { account:"", name:"", trustIndex:"", ip:"", lastname: result.lastname, immatriculation: result.immatriculation, vehicle: result.vehicle, year: result.year};
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



router.post('/groupes/add', (req, res, next) => {
    var name = req.body.grpname;
    var ip = req.body.ip;
    var ipgrp= req.body.ipgrp;
    var idg;

   var a;
 

    Group.find({name: name}).exec().then(async (result) => {
	a=result;
	if(result.length == 0) {
		Group.find().then((response) => {
        			idg=response.length;});
		  const group = new Group({
                _id: new mongoose.Types.ObjectId(),
                grIP:ipgrp,
		        grId:idg,
                name: req.body.grpname,
		        list: [ip],
                       });
		group.save().then((response) => {
						res.status(200).json({
						    message: 'it was added to a group',
						    response: response
						})
					})
		
		}
	else{
		//a.list.push(ip);
		Group.update({name: name}, {$push: {list : ip }})
                            .exec()
                            .then((result) => {
                                console.log(result);
                                res.status(200).json(result);
                            }).catch((err) => {
                                console.log(err);
                                res.status(500).json({
                                    error : err
                                })
                            });
		idg =  Number(hashids.decode(result[0].bcId))
		console.log(idg);
	
		
	}

    await User.find({ipAddress: ip}).exec().then(async (result) => {
	if(result.length == 0) {
		    	return res.status(409).json({
		        message: 'IP does not exist in database'
		    })
	} else {
		await truffleContract.addgrp(idg,ip).then((response) => {
			
		})
		}
    	})
	}).catch((err) => {
			console.log(err);
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

router.get('/groupes/search',  (req, res, next) => {
        var ip = req.body.ip;
	var names = [];
	Group.find({list: { $in: ip }}).then(  (result) => {
		console.log(result);
	  /*for(let j = 0; j <= result.length; j++) {
		var info = { name:"", list:""};
		info.name = result[j].name;
		console.log(info.name);
		info.list = result[j].list;
		console.log(info.list);
		names.push(info);
		console.log(info);
		}*/
	return res.status(200).json({
		        responce: result
		    })
	
	}).catch((err) => {
			console.log(err);
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
