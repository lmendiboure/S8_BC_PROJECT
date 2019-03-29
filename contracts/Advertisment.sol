pragma solidity ^0.5.0;

//import "./Subscriptions.sol";

contract Advertisment {

    mapping(uint => address) public advertismentArray;
    uint public counter;

    function addSubscriberToAds(address _userAddress) public payable {
        counter++;
        advertismentArray[counter] = _userAddress;
    }
    
    /*function sendAd(string memory _msg) public payable {
        for(uint i = 1; i <= counter; i++) {
            //send msg to all users in mapping
        }
    }*/

}