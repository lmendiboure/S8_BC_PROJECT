pragma solidity ^0.5.0;

import "./User.sol";

contract Iov {

    address private admin;

    modifier onlyAdmin {
        require(admin == msg.sender, 'error is here');
        _;
    }

    // Store vehicles
    // Search for vehicle
    mapping(uint => User) public vehicleArray;

    // Keep track of vehicles count
    uint public vehicleCount;
        
    event userAdded(string _name);

    constructor() public payable {
        admin = msg.sender;
        addVehicle(admin, "Vehicle 1");
        addVehicle(admin, "Vehicle 2");
    }

    function addVehicle(address _admin, string memory _name) public payable onlyAdmin {
        vehicleCount++;
        vehicleArray[vehicleCount] = new User(vehicleCount, _name, computeVehicleTrustIndex(), 10, _admin);
        //emit userAdded(_name);
    }

    // calculation of average vehicle trust index
    function computeVehicleTrustIndex() private pure returns(uint){
        return 10;
    }
    
    function getTrustIndexByAddress(address _userAddress) public view returns(uint) {
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
    }
    
}