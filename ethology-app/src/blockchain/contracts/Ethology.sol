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
        INIT,
        CANCELLED,
        PROCURED,
        DELIVERED
    }

    struct purchaseOrder {
        buyerPhase buyerStatus;
        supplierPhase supplierStatus;
        product productInfo;
        uint256 timestamp;
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
            msg.sender != supplier,
            "Only the authorized buyer can call this function"
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

    function getPOList(address buyerAddress)
        public
        view
        onlyBuyer
        returns (purchaseOrder[] memory)        
    {        
        return poList[buyerAddress];
    }

    // function to add a product to the marketplace
    function raisePO(uint256 id, uint256 price) public onlyBuyer {
        purchaseOrder memory po = purchaseOrder(
            buyerPhase.RAISE_PO,
            supplierPhase.INIT,
            product(id, price),
            block.timestamp
        );
        poList[msg.sender].push(po);
    }
}
