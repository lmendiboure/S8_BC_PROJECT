pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

//import "./Subscriptions.sol";
//import "./Advertisment.sol";

contract User {

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
	uint public id;
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
	
	//string[] public subs;
    
    //Advertisment public ads = new Advertisment();
    //Emergencies public emergencies;
    
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
	
	/*function getRightCanSend() public view returns(bool) {
	    return rights.canSend;
	}
	
	function getRightCanRecv() public view returns(bool) {
	    return rights.canRecv;
	}*/

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
	
	/*function changeRightCanSend(address _admin, bool _right) public payable returns(bool) {
	    require(admin == _admin);
	    rights.canSend = _right;
	    return rights.canSend;
	}
	
	function changeRightCanRecv(address _admin, bool _right) public payable returns(bool) {
	    require(admin == _admin);
	    rights.canRecv = _right;
	    return rights.canRecv;
	}
	
	function sendMessage(address _sendTo) public {
	    User u = User(_sendTo);
	    assert(rights.canSend);
	    assert(u.getRightCanRecv());
	    emit sendVideo(msg.sender);
	}
	
	function recvMessage(address _recvFrom) public {
	    User u = User(_recvFrom);
	    assert(rights.canRecv);
	    assert(u.getRightCanSend());
	    emit recvVideo(_recvFrom);
	}*/
	
	/*function addSubscription(string memory _name) public returns(string[] memory) {
	    subs.push(_name);
	    return subs;
	}
	
	function subscribeToAds(string memory _name) public payable {
	    addSubscription(_name);
	    Advertisment u = Advertisment(ads);
	    u.addSubscriberToAds(msg.sender);
	}*/

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
	
}