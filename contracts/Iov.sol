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
    
    uint public vehicleCount;
        
    event userAdded(uint _id,address _UserAdded,string _name);
    event userDeleted(uint _id);
    event IPAdded(uint _id,string _IP);
    
    event returnFeedback(
        address  _recv,bool _feedback
    );

 constructor() public payable {
        admin = msg.sender;
        vehicleArray[vehicleCount] = new User(0,"admin", 10000,msg.sender,msg.sender,"vip IP");
        moneyCount[0]=0;
    }

    function addVehicle(address _admin, string memory _name,address _myUserAd,string memory _IP) public payable onlyAdmin {
        vehicleCount++;
        vehicleArray[vehicleCount]= new User(vehicleCount, _name, 0, _admin,_myUserAd,_IP);
        moneyCount[vehicleCount]=0;
       emit userAdded(vehicleCount,_myUserAd,_name);
    }
    
     function deleteVehicle(uint _id) public onlyAdmin {
        vehicleArray[_id] = vehicleArray[vehicleCount];
        delete vehicleArray[vehicleCount];
        vehicleCount--;
    }
    
    function AskHelp(uint _iduser,string memory _msg) public payable {
        sosUsers[_iduser] = new SOS(_iduser);
        sosUsers[_iduser].senSos(_msg);
    }
    
   /* function shareAdv (bytes24 _ipuser,address _to) public payable {
        uint canAdv;
        
        for (uint i=0; i<vehicleCount+1; i++) {
            if(getRightCanSendById(_ipuser,i)==true){
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
    } */

     function getIdbyAdd(address _add) public view returns(uint) {
	 for (uint i=0; i<vehicleCount+1; i++) {
    	        if(vehicleArray[i].getAddress() == _add)
                    return i;
             }
    }

    function getAddressIPById(uint _id) public view returns(string memory) {
        return(vehicleArray[_id].getAddressIP());
    } 
   
 function getAddressById(uint _id) public view returns(address) {
    return(vehicleArray[_id].getAddress());
   } 
    
    function addAddressIPtolist(uint _id,string memory _IP) public payable {
        vehicleArray[_id].addAddressIP(_IP);
	emit IPAdded(_id,_IP);
    }
   
   function getTrustIndexById(uint _id) public view returns(uint) {
        return(vehicleArray[_id].getTrustIndex());
    }
   
    function getRightCanSendById(uint _myid,string memory _IP) public view returns(bool) {
        return vehicleArray[_myid].getRightCanSend(_IP);
    }

    
    function incrementTrustIndex(uint _id) public payable returns(uint){
        return vehicleArray[_id].incrementTrustIndex();
    }
    
    function decrementTrustIndex(uint _id) public payable returns(uint) {
        return vehicleArray[_id].decrementTrustIndex();
    }
    
    function changeRightCanSendByid(address _admin, uint _id, bool _right,uint _idwanted) public payable {
        string memory IP = vehicleArray[_idwanted].getAddressIP();
        vehicleArray[_id].changeRightCanSend(_admin, _right, IP);
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



//****************************************************************************
//old_format



/*

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
        vehicleArray[_id] = vehicleArray[vehicleCount];
        delete vehicleArray[vehicleCount];
        vehicleCount--;
    }

    // calculation of average vehicle trust index
    function computeVehicleTrustIndex() private pure returns(uint){
        return 10;
    }
    

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
*/
    
}
