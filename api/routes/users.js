const express = require('express');
const truffleContract = require('../../connection/app.js');
var async = require('async');
const router = express.Router();
const bcrypt = require('bcrypt');
var Hashids = require('hashids');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads/');
    },
    filename: function(req, file, callback) {
        callback(null, new Date().toISOString() + file.originalName);
    }
});

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        callback(null, true); //accept file
    } else { // reject file
        callback(null, false);
    }
};

const upload = multer({
    storage: storage, 
    limits: {
    fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});
  
var hashids = new Hashids('', 10);

const mongoose = require('mongoose');

const User = require('../models/users');
const Report = require('../models/report');

router.post("/login", (req, res, next) => {
    var identifiant;
    User.find({ pseudo: req.body.pseudo })
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
            identifiant = user[0]._id;
            const token = jwt.sign(
              {
                pseudo: user[0].pseudo,
                userId: user[0]._id,
                blockAddress : user[0].bcAddress
              },
              process.env.JWT_KEY,
              {
                  expiresIn: "1h"
              }
            );
            console.log("you're here");
            return res.status(200).json({
              message: "Auth successful",
              id: identifiant,
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
    User.find({_id: id})
    .exec()
    .then((user) => {
        if(user.length > 1) {
            console.log(user);
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



router.patch('/profile/:userId', checkAuth, /*upload.single('profileImage'), */(req, res, next) => {
   //console.log(req.file);
    const id = req.params.userId;
    var name;
    var immatriculation;
    User.find({_id: id})
    .exec()
    .then((user) => {
            //const updateOps = {profileImage: req.file.path};
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
                            .then(async (result) => {
                                //console.log(result);
                                await truffleContract.changeName(hashids.decode(user[0].bcId), user[0].name).then((response) => {
                                    console.log(response)
                                    name = response;
                                 
                                    truffleContract.changeImmatriculation(hashids.decode(user[0].bcId), updateOps['immatriculation']).then((result) => {
                                        //console.log(user);
                                        immatriculation = result;

                                        res.status(200).json({
                                            message: 'info modified',
                                            name: name,
                                            immatriculation: immatriculation,
                                            /*request: {
                                                type: 'GET',
                                                url: "http://localhost:3000/products/" + result._id
                                            }*/
                                        })
                                })
                                //res.status(200).json(result);
                                
                            })
                            
                            }).catch((err) => {
                                //console.log(err);
                                res.status(500).json({
                                    error : err
                                })
                            })
                        }
                    });
                }
            }
        
    })
});

router.get('/rightsend', checkAuth, (req, res, next) => {
      var ip = req.body.ip;

      User.find({ipAddress: ip}).exec().then(async (result) => {
		if(result.length == 0) {
		    	return res.status(409).json({
		        message: 'IP does not exist in database'
		    		});}
		else {
			 	var id = Number(hashids.decode(result[0].bcId))+1;
				console.log(id);
			 await truffleContract.getsendrights(id,ip).then((response) => {
			    res.status(200).json({
				message: 'Can he send from this user-id ?',
				deletedUser: response
			    })
			})
		    }
    }).catch((err) => {
        res.send(err.message);
    });
});

router.get('/add', checkAuth, (req, res, next) => {
     var myip = req.body.myip;
     var ipadded = req.body.ipadded;
      User.find({ipAddress: myip}).exec().then(async (result) => {
		var id = Number(hashids.decode(result[0].bcId))+1;
		//console.log(result);
		if(result.length == 0) {
		    	return res.status(409).json({
		        message: 'IP does not exist in database'
		    		});}
		else {
			 	 User.find({ipAddress: ipadded}).exec().then(async (result) => {
					if(result.length == 0) {
					    	return res.status(409).json({
						message: 'IP does not exist in database, You have to add it First'
					    		});}
					 }).catch((err) => {
							res.send(err.message);
						    });
			        await truffleContract.addAddressTolist(id,ipadded).then((response) => {
					console.log(response);
			                  res.status(200).json({
					  message: 'it was added'
			   		 })
			        })
		    }
    }).catch((err) => {
        res.send(err.message);
    });
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
            var info = { account:"", name:"", trustIndex:"", ip:""};
 		await truffleContract.renderAccount(j).then(async (response) => {
                info.account = response;
                await truffleContract.renderName(j).then(async (response) => {
                    info.name = response;
                    await truffleContract.renderTrustIndex(j).then(async (response) => {
                        info.trustIndex = response.toNumber();
			  await truffleContract.renderAddressIP(j).then(async (response) => {
					info.ip=response;
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

router.get('/:userId', checkAuth, (req, res, next) => {
    var json =[];
    const id = req.params.userId;

    User.findById(id).exec().then(async (result) => {
        if(result) {
            blockId = Number(hashids.decode(result.bcId)) + 1;
            //console.log(blockId);
            //console.log('hello ' + hashids.decode(result.bcId));
            var info = { account:"", 
            name:"", 
            trustIndex:"", 
            ip:"", 
            lastname: result.lastname, 
            immatriculation: result.immatriculation, 
            vehicle: result.vehicle, 
            year: result.year, 
            image: result.profileImage};
            await truffleContract.renderAccount(blockId).then(async (response) => {
                info.account = response;
                //console.log(json);
                console.log(response)
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

router.post('/report/:userBcAddress', (req, res, next) => {
    var adr = req.params.userBcAddress;
    console.log(adr)
    const report = new Report({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        signalingAddress: adr,
        userAddress: req.body.userAddress,
        description: req.body.description,
        date: req.body.date,
    })
    console.log(report);
    report.save().then((response) => {
        //console.log(result);
        res.status(200).json({
            message: 'signalement fait',
            response: response
        })
    }).catch((err) => {
        res.send(err.message);
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
