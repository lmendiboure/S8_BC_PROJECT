pragma solidity ^0.5.0;

import "./Advertisment.sol";
import "./Emergencies.sol";

contract Subscriptions is Advertisment, Emergencies {
    
    enum subscriptionType {
        advertisment,
        emergencies
    }
    
    mapping(uint => string) public list;
    uint counter;

    constructor() public {
        addSub("advertisment");
        addSub("emergencies");
    }
    
    function addSub(string memory _name) public payable {
        counter++;
        list[counter] = _name;
    }

    function get(subscriptionType _s) public pure returns(subscriptionType) {
        subscriptionType s = _s;
        return s;
    }
    
    function subscribeTo(uint _type, address _userAddress) public {
        if(_type == 1 ) {
            addSubscriberToAds(_userAddress);
        }
        if(_type == 2) {
            addSubscriberToEmergencies(_userAddress);
        }
    }
    
}