// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// contract for healthcare marketplace
contract Ethology {
    // structs for representing the data
    struct product {
        uint256 id;
        uint256 price;
    }

    enum buyerPhase {
        RAISE_PO,
        WITHDRAW_PO,
        FREEZE_PO
    }

    enum supplierPhase {
        PROCURED,
        DELIVERED
    }

    struct purchaseOrder {
        buyerPhase buyerStatus;
        supplierPhase supplierStatus;
        product productInfo;
    }

    // map representing the products the client has ordered
    mapping(address => purchaseOrder[]) poList;

    // owner of the contract
    address supplier;

    // constructor
    constructor() {
        supplier = msg.sender;
    }

    //  modifiers for restricted functions
    modifier onlySupplier() {
        require(
            msg.sender == supplier,
            "Only the supplier can call this function"
        );
        _;
    }

    modifier onlyBuyer() {
        require(
            msg.sender != supplier && poList[msg.sender].length > 0,
            "Only the authorized buyer can call this function"
        );
        _;
    }
}
