pragma solidity ^0.5.0;

contract SOS {
    
    //le flux d'urgence
    uint public iduser;
    string public name = "SOS";
    bool use;

    event sendSos(
        string  _content
    );
    
    constructor(uint _iduser) public payable {
            iduser = _iduser;
            use = true;
	}
   
	function getNameFlux() public view returns(string memory) {
	    return name;
	}
	
	function getUseflux() public view returns(bool) {
	    return use;
	}
	
	function getIduser() public view returns(uint) {
	    return iduser;
	}
    
    function turnOnflux() public  {
	    use=true;
	}
    
    function turnOffflux() public {
	    use=false;
	}
    function senSos(string memory _msg) public {
	    emit sendSos(_msg);
	}

}

contract Adv {
 
   //le flux des videos 
        
    string public name = "Adv";
    uint public iduser;
    bool use;
    
    event shareVd(
        address  _to
    );
    
     constructor(uint _iduser) public payable {
            iduser = _iduser;
            use = true;
	}
	
    function getNameFlux() public view returns(string memory) {
	    return name;
	}
	
	function getuseflux() public view returns(bool) {
	    return use;
	}
	
    function turnOnflux() public  {
	    use=true;
	}
    
    function turnOfflux() public {
	    use=false;
	}
	
    function shareAds(address _to) public {
        emit shareVd(_to);
	}
	
}