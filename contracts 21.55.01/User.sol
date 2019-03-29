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
	string public name;
	uint public trustIndex;
	uint public videoTime; // In seconds
	accessMode public rights;

	// A user is also defined by its rights
	struct accessMode {
		bool canSend;
		bool canRecv;
	}
	
	//string[] public subs;
    
    //Advertisment public ads = new Advertisment();
    //Emergencies public emergencies;
    
    address public admin;
    
    event sendVideo(address _sendTo);
    event recvVideo(address _recvFrom);
    
	constructor(uint _id, string memory _name, uint _trustIndex, uint _videoTime, address _admin) public {
		id = _id;
		name = _name;
		trustIndex = _trustIndex;
		videoTime = _videoTime;
		rights.canSend = true;
		rights.canRecv = true;
		admin = _admin;
	}
	
	function getTrustIndex() public view returns(uint) {
	    return trustIndex;
	}
	
	function getRightCanSend() public view returns(bool) {
	    return rights.canSend;
	}
	
	function getRightCanRecv() public view returns(bool) {
	    return rights.canRecv;
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
	
	function changeRightCanSend(address _admin, bool _right) public payable returns(bool) {
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
	}
	
	/*function addSubscription(string memory _name) public returns(string[] memory) {
	    subs.push(_name);
	    return subs;
	}
	
	function subscribeToAds(string memory _name) public payable {
	    addSubscription(_name);
	    Advertisment u = Advertisment(ads);
	    u.addSubscriberToAds(msg.sender);
	}*/
	
}