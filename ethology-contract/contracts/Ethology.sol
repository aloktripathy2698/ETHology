
// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.22 <0.9.0;

contract hcsc{
    
    struct healthcareProvider{
        uint hcpID;
    }

    struct product {
        uint pid;
        uint pcount;
        uint pamount;
    }

     product[] public products;

    address chairperson;
    mapping (address => healthcareProvider) hcp;
    mapping (address => product) public availableProducts;

    enum Phase {Init, inStock, out_of_stock}
    Phase public state = Phase.Init;

    constructor(uint numberOfProducts) public {
        chairperson = msg.sender;
        for (uint i = 0; i < numberOfProducts; i++){
            products[i] = product(i, 0, 0);
        }
    }
}