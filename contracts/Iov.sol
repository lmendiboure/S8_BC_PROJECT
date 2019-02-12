pragma solidity ^0.5.0;

contract Iov {

    // Model a vehicle
    struct Vehicle {
        uint id;
        string name;
        uint trustIndex;
        uint videoTime; // In seconds
        //accessMode rights;
    }

    // Store vehicles
    // Search for vehicle
    mapping(uint => Vehicle) public vehicleArray;

    // Keep track of vehicles count
    uint public vehicleCount;

    // Access modes for vehicle
    struct accessMode{
        bool canSend;
        bool canRecv;
    }
    
        
    constructor() public{
        addVehicle("Vehicle 1");
        addVehicle("Vehicle 2");
    }

    function addVehicle(string memory _name) public {
    	vehicleCount++;
    	vehicleArray[vehicleCount] = Vehicle(vehicleCount, _name, computeVehicleTrustIndex(vehicleCount), 10);
    }

    // calculation of average vehicle trust index
    function computeVehicleTrustIndex(uint _id) internal returns(uint){
        vehicleArray[_id].trustIndex = 10;
        return vehicleArray[_id].trustIndex;
    }

    // increment vehicle trust index
    function incrementVehicleTrustIndex(uint _id) internal {
        vehicleArray[_id].trustIndex++;
    }
    
    // decrement vehicle trust index
    function decrementVehicleTrustIndex(uint _id) internal {
        vehicleArray[_id].trustIndex--;
    }

     // Make sure the sender can be trusted to share content
    function canShareVideo(uint _id) public returns(bool) {
        require(vehicleArray[_id].trustIndex >= 5);
        return true;
    }
    
    // Make sure the receiver has good behavior to receive content
    function canReceiveVideo(uint _id) public returns(bool) {
        require(vehicleArray[_id].trustIndex >= 5);
        return true;    
    }

    function incrementVideoTime(uint _id) public {
        vehicleArray[_id].videoTime += 10;
    }

    function decrementVideoTime(uint _id) public {
        vehicleArray[_id].videoTime -= 10;
    }
    
    // Feedback for vehicle behavior
    function feedBack(uint _id, bool _bool) public {
    	if(_bool) {
    		incrementVehicleTrustIndex(_id);
            incrementVideoTime(_id);
			// Call function payable to pay the publisher    		
    	} else {
    		decrementVehicleTrustIndex(_id);
            decrementVideoTime(_id);
    	}
    } 
   
}