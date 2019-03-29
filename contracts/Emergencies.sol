pragma solidity ^0.5.0;

//import "./Subscriptions.sol";

contract Emergencies {

	mapping(uint => address) public emergencyArray;
	uint public counter;

	function addSubscriberToEmergencies(address _userAddress) public payable {
		counter++;
		emergencyArray[counter] = _userAddress;
	}

}