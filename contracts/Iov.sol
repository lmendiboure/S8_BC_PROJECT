pragma solidity ^0.5.0;

import "./User.sol";
import "./Flux.sol";

contract Iov {

    address private admin;

    modifier onlyAdmin {
        require(admin == msg.sender, 'You are not the admin');
        _;
    }

    // Store vehicles
    // Search for vehicle
    mapping(uint => User) public vehicleArray;

    mapping(uint => Adv) public advUsers;
    mapping(uint => SOS) public sosUsers;

    mapping(uint => int256 ) public moneyCount;

    // Keep track of vehicles count
    uint public vehicleCount;
        
    event userAdded(uint _id,string _name);
    event userDeleted(uint _id);
    
    event returnFeedback(
        address  _recv,bool _feedback
    );

    constructor() public payable {
        admin = msg.sender;
        addVehicle(admin, "Vehicle 1");
        addVehicle(admin, "Vehicle 2");
    }

    function addVehicle(address _admin, string memory _name) public payable onlyAdmin {
        vehicleCount++;
        vehicleArray[vehicleCount] = new User(vehicleCount, _name, computeVehicleTrustIndex(), 10, _admin);
        //emit userAdded(_name);
        moneyCount[vehicleCount]=0;
        emit userAdded(vehicleCount,_name);
    }

    function deleteVehicle(uint _id) public onlyAdmin {
        //delete vehicleArray[_id];
        vehicleArray[_id] = vehicleArray[vehicleCount];
        delete vehicleArray[vehicleCount];
        vehicleCount--;
        //emit userDeleted(_id);
    }

    // calculation of average vehicle trust index
    function computeVehicleTrustIndex() private pure returns(uint){
        return 10;
    }
    
    /*function getTrustIndexByAddress(address _userAddress) public view returns(uint) {
        User u = User(_userAddress);
        return u.getTrustIndex();
    }
    
    function getRightCanSendByAddress(address _userAddress) public view returns(bool) {
        User u = User(_userAddress);
        return u.getRightCanSend();
    }
    
    function getRightCanRecvByAddress(address _userAddress) public view returns(bool) {
        User u = User(_userAddress);
        return u.getRightCanRecv();
    }
    
    function incrementTrustIndex(address _userAddress) public payable returns(uint){
        User u = User(_userAddress);
        return u.incrementTrustIndex();
    }
    
    function decrementTrustIndex(address _userAddress) public payable returns(uint) {
        User u = User(_userAddress);
        return u.decrementTrustIndex();
    }
    
    function incrementTrustIndexByValue(address _userAddress, uint _value) public payable returns(uint) {
        User u = User(_userAddress);
        return u.incrementTrustIndexByValue(_value);
    }
    
    function decrementTrustIndexByValue(address _userAddress, uint _value) public payable returns(uint) {
        User u = User(_userAddress);
        return u.decrementTrustIndexByValue(_value);
    }
    
    function changeRightCanSendByAddress(address _admin, address _userAddress, bool _right) public payable returns(bool) {
        User u = User(_userAddress);
        return u.changeRightCanSend(_admin, _right);
    }
    
    function changeRightCanRecvByAddress(address _admin, address _userAddress, bool _right) public payable returns(bool) {
        User u= User(_userAddress);
        return u.changeRightCanRecv(_admin, _right);
    }*/

    function getTrustIndexById(uint _id) public view returns(uint) {
        return(vehicleArray[_id].getTrustIndex());
    }
   
    function getRightCanSendById(uint _myid,uint _idwanted) public view returns(bool) {
        return vehicleArray[_myid].getRightCanSend(_idwanted);
    }

    function getRightCanRecvById(uint _myid,uint _idwanted) public view returns(bool) {
        return vehicleArray[_myid].getRightCanRecv(_idwanted);
    }
    
    function incrementTrustIndex(uint _id) public payable returns(uint){
        return vehicleArray[_id].incrementTrustIndex();
    }
    
    function decrementTrustIndex(uint _id) public payable returns(uint) {
        return vehicleArray[_id].decrementTrustIndex();
    }
    
    function changeRightCanSendByid(address _admin, uint _id, bool _right,uint _idwanted) public payable {
        vehicleArray[_id].changeRightCanSend(_admin, _right, _idwanted);
    }
    
    function changeRightCanRecvByid(address _admin, uint _id, bool _right,uint _idwanted) public payable {
        vehicleArray[_id].changeRightCanRecv(_admin, _right, _idwanted);
    }
    
    function sendMessagebyid(uint _id,uint _idwanted,address _sendTo,string memory _msgS) public {
            vehicleArray[_id].sendMessage(_idwanted,_sendTo,_msgS);
    }
    
    function recvMessagebyid(uint _id,uint _idwanted,address _recvFrom,string memory _msgR) public {
            vehicleArray[_id].recvMessage(_idwanted,_recvFrom,_msgR);

    }



    function AskHelp(uint _iduser,string memory _msg) public payable {
        sosUsers[_iduser] = new SOS(_iduser);
        sosUsers[_iduser].senSos(_msg);
    }
    
    function shareAdv (uint _iduser,address _to) public payable {
        uint canAdv;
        
        for (uint i=0; i<vehicleCount+1; i++) {
            if(getRightCanSendById(_iduser,i)==true){
                canAdv++;
            }
        }
        require(
            canAdv == vehicleCount,
        "He can send to everyone else");
        
         require(
            getTrustIndexById(_iduser) > 2000,
            "There already is a higher Trust Index."
        );
    
        advUsers[_iduser] = new Adv(_iduser);
        advUsers[_iduser].shareAds(_to);
    }

    function giveMoney(uint _iduser,int256 _value) public payable{
        moneyCount[_iduser]=_value;
    }
    
    function giveFeedback(uint _iduser,address _recv,bool _feedback) public payable{
        if( _feedback == true){
           giveMoney(_iduser,100);
            emit returnFeedback(_recv,_feedback);    
            }
        else{
            giveMoney(_iduser,-100);
            emit returnFeedback(_recv,_feedback);
        }
        
    }
    
}