pragma solidity ^0.6.0

contract hcsc{
    
    struct healthcareProvider{
        uint hcpID;
    }

    struct product{
        uint pid;
        uint pcount;
        uint pamount;
    }

    address chairperson;
    mapping (address => healthcareProvider) hcp;
    mapping (address => product) public availableProducts;
    product[] products;

    enum Phase {Init, inStock, out_of _stock}
    Phase public state = Phase.Init;

    constuctor (uint numberOfProducts) public{
        chairperson = msg.sender;
        for (uint i = 0; i < numberOfProducts; i++){
            products.push(product[0]);
        }
    }
}