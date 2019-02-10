pragma solidity ^0.5.0;

contract Iov {
    
    address owner;
    mapping(uint => Application) public appArray;
    uint applicationCount;
    
    // Application information (pki, content, etc)
    struct Application {
        uint id;
        string name;
        string content;
        string author;
        string public_key;
        uint trustIndex;
    }
    
    modifier onlyOthers {
        require(msg.sender != owner);
        _;
    }
    
    // Blockchain node signer
    /*struct Signature {
        
    }
    
    // Agreed terms (nodes, resources)
    struct ResourcesContract {
        
    }*/
    
    Application application;
    //Signature[] signatures;
    
    //ResourcesContract[] resourcesContracts;
    
    // Smart contract instanciation (Application)
    constructor() public{
        owner = msg.sender;
    }

    /*function addApplication(string memory _name, string memory _content, string memory _author, string memory _publicKey) private {
        applicationCount++;
        appArray[applicationCount] = Application(applicationCount, _name, _content, _author, _publicKey, computeApplicationTrustIndex());
    }*/
    
    // Application certification (signature)
    /*function signApplication(signer_node_infos_table) {
        
    }
    
    // low A-TI, dangerous behavior : revocation
    function revokeApplication() {
        
    }
    
    // resources allocation (Resources contract)
    function resourcesContractInit() {
        
    }
    
    // contract modification, free resources
    function resourcesContractCancellation() {
        
    }*/
    
    // decrement A-TI
    function decrementApplicationTrustIndex() public onlyOthers{
        application.trustIndex--;
    }
    
    // calculation of average A-TI
    function computeApplicationTrustIndex() internal{
        application.trustIndex = 10;
    }
    
    function getName() view public returns(string memory) {
        return application.name;
    }

    function getContent() view public returns(string memory) {
        return application.content;
    }
    
    function getTrustIndex() view public returns(uint) {
        return application.trustIndex;
    }
}