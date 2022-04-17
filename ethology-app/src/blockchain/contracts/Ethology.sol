// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <=0.9.0;

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
        INIT,
        CANCELLED,
        PROCURED,
        DELIVERED
    }

    struct purchaseOrder {
        buyerPhase buyerStatus;
        supplierPhase supplierStatus;
        uint256 price;
        uint256 id;
        address buyer;
    }

    // map representing the products the client has ordered
    mapping(address => purchaseOrder[]) poList;

    // owner of the contract
    address supplier;
    address buyer;
    uint256 buyerCount;
    purchaseOrder[] buyerPO;

    // address[] addresses;
    // buyerPhase[] buyerPhases;

    // constructor
    constructor() {
        supplier = msg.sender;
        buyer = msg.sender;
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
            msg.sender != supplier,
            "Only the buyer can call this function"
        );
        _;
    }

    // utility functions
    function getSupplier() public view returns (address) {
        return supplier;
    }

    function getBuyer() public view returns (address) {
        return msg.sender;
    }

    function getPOList() public view returns (purchaseOrder[] memory) {
        return buyerPO;
    }

    // ideally how it should be
    function raisePo(uint256 id, uint256 price) public onlyBuyer {
        buyerPO.push(
            purchaseOrder({
                buyerStatus: buyerPhase.RAISE_PO,
                supplierStatus: supplierPhase.INIT,
                price: price,
                id: id,
                buyer: msg.sender
            })
        );
    }
}
