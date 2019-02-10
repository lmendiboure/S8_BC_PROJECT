pragma solidity ^0.5.0;

contract ApplicationManagement {
    
    // Application information (pki, content, etc)
    struct Application {
        string name;
        string content;
        //string public_key;
        uint trustIndex;
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
    constructor(string memory _name, string memory _content) public{
        application.name = _name;
        application.content = _content;
    }
    
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
        
    }
    
    // decrement A-TI
    function decrementApplicationTrustIndex() {
        
    }
    
    // calculation of average A-TI
    function computeApplicationTrustIndex() {
        
    }*/
    
    function getContent() view public returns(string memory) {
            return application.content;
    }
}