pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;


contract User {


struct accessMode {
	    string IP;
	    bool canSend;
	}

    mapping(uint=> accessMode) public vehicleAccess;
    address public admin;

	uint public id;
	string public name;
	string public immatriculation;
	uint public trustIndex;
	uint public netCount;
	address myUserAd;
	string IP;


	event sendMsg(
        address  _from,
        uint _id,
        string msgS
    );

    event recvMsg(
        address _from,
        uint _id,
        string _msgR
    );


	constructor(uint _id, string memory _name, uint _trustIndex,address _admin,address _myUserAd,string memory _IP) public payable {
		id = _id;
		name = _name;
		trustIndex = _trustIndex;
		netCount=1;
        	vehicleAccess[netCount].IP=_IP;
		vehicleAccess[netCount].canSend=true;
		admin = _admin;
		myUserAd = _myUserAd;
		IP=_IP;

	}

	function changeName(string memory _name) public payable {
		name = _name;
		//return name;
	}

	function changeImmatriculation(string memory _immatriculation) public payable{
		immatriculation = _immatriculation;
		//return immatriculation;
	}

 	function compareStrings (string memory a, string memory b) public view returns (bool) {
             return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))) );

       }

	function getTrustIndex() public view returns(uint) {
	    return trustIndex;
	}

	function getAddressIP() public view returns(string memory) {
	    return IP;
	}

	function getId() public view returns(uint) {
	    return id;
	}

	function getAddress() public view returns(address) {
	    return myUserAd;
	}

	function getRightCanSend(string memory  _IP) public view returns(bool) {
    	    for (uint i=1; i<netCount+1; i++) {
    	        if(compareStrings(_IP,vehicleAccess[i].IP)){
                    return vehicleAccess[i].canSend;}
             }

	}

	function addAddressIP(string memory  _IP) public payable{
	     netCount++;
	     vehicleAccess[netCount].canSend=true;
             vehicleAccess[netCount].IP=_IP;
	}

	function incrementTrustIndex() public payable returns(uint) {
	    return trustIndex+=1;
	}

	function decrementTrustIndex() public payable returns(uint) {
	    return trustIndex--;
	}

	function changeRightCanSend(address _admin, bool _right,string memory _IP) public payable {
	    require(admin == _admin);
	    for (uint i=1; i<netCount+1; i++) {
    	        if(compareStrings(_IP,vehicleAccess[i].IP))
                    vehicleAccess[i].canSend = _right;
             }
	}


//***************************************************
//old_version

    // I should add a modifier access to functions increment and decrement : Done //


    // Essayer d'envoyer des msgs entre users en modifiant le trustIndex //
    // Et voir les différentes interactions //
    // Comment gérer ces cas ? //
    // Dois je toujours passer par l'admin ? //
    // L'admin associe au user les droits d'accès et seul lui peut les modifier //


    // Commment gérer le feedback ? //
    // Les users envoient tous leurs avis et leurs appréciations //
    // L'admin prend en compte tous les retours //
    // Et en fonction de ces retours là il exécute sa tâche //
    // En calculant de nouveau l'indice de confiance et en modifiant les droits des users //

    // Le ffedback //
    // chaque uqser émet son avis sans l'intervention de l'admin //
    // C'est plus facile-, automatique, rapide et ça renforce l'utilité de la décentralisation //

	// A user is defined by :

/*	uint public id;
	string public ip;
	string public name;
	uint public trustIndex;
	uint public videoTime; // In seconds
	accessMode public rights;

	// A user is also defined by its rights
	struct accessMode {
		bool canSend;
		bool canRecv;
	}

	mapping(uint => accessMode) public vehicleAccess;


	event sendMsg(
        address  _from,
        uint _id,
        string msgS
    );

    event recvMsg(
        address _from,
        uint _id,
        string _msgR
    );
    address public admin;

    event sendVideo(address _sendTo);
    event recvVideo(address _recvFrom);

	constructor(uint _id, string memory _name, uint _trustIndex, uint _videoTime, address _admin) public {
		id = _id;
		//ip = _ip;
		name = _name;
		trustIndex = _trustIndex;
		videoTime = _videoTime;
		for (uint i=0; i<id+1; i++) {
           		 vehicleAccess[i].canSend=true;
	    		 vehicleAccess[i].canRecv=true;
        }
		admin = _admin;
	}

	function getTrustIndex() public view returns(uint) {
	    return trustIndex;
	}

	function getRightCanSend(uint _idwanted) public view returns(bool) {
	    return vehicleAccess[_idwanted].canSend;
	}

	function getRightCanRecv(uint _idwanted) public view returns(bool) {
	    return vehicleAccess[_idwanted].canRecv;
	}

	function incrementTrustIndex() public payable returns(uint) {
	    //require(admin == _admin);
	    return trustIndex++;
	}

	function decrementTrustIndex() public payable returns(uint) {
	    //require(admin == _admin);
	    return trustIndex--;
	}

	function incrementTrustIndexByValue(uint _value) public payable returns(uint) {
	    //require(admin == _admin);
	    return trustIndex + _value;
	}

	function decrementTrustIndexByValue(uint _value) public payable returns(uint) {
	    //require(admin == _admin);
	    return trustIndex - _value;
	}


	function changeRightCanSend(address _admin, bool _right,uint _idwanted) public payable returns(bool) {
	    require(admin == _admin);
	    vehicleAccess[_idwanted].canSend = _right;
	    return vehicleAccess[_idwanted].canSend;
	}

	function changeRightCanRecv(address _admin, bool _right,uint _idwanted) public payable returns(bool) {
	    require(admin == _admin);
	    vehicleAccess[_idwanted].canRecv = _right;
	    return vehicleAccess[_idwanted].canRecv;
	}

	function sendMessage(uint _idwanted,address _sendTo,string memory _msgS) public {
	    User u = User(_sendTo);
	    assert(vehicleAccess[_idwanted].canSend);
	    assert(u.getRightCanRecv(_idwanted));
	    emit sendMsg(_sendTo,_idwanted,_msgS);
	}

	function recvMessage(uint _idwanted,address _recvFrom,string memory _msgR) public {
	    User u = User(_recvFrom);
	    assert(vehicleAccess[_idwanted].canRecv);
	    assert(u.getRightCanSend(_idwanted));
	    emit recvMsg(_recvFrom,_idwanted,_msgR);
	}

*/

}
