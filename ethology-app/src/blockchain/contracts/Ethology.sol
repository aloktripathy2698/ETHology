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
        FREEZE_PO,
        WITHDRAW_PO
    }

    enum supplierPhase {
        INIT,
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
    address payable supplier;
    uint256 buyerCount;
    purchaseOrder[] buyerPO;

    // constructor
    constructor() {
        supplier = payable(msg.sender);
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

    function updateBuyerPhase(
        buyerPhase phase,
        uint256 id,
        address addr
    ) public onlyBuyer {
        // loop over the buyerPO array
        for (uint256 i = 0; i < buyerPO.length; i++) {
            // if the id matches
            if (buyerPO[i].id == id && buyerPO[i].buyer == addr) {
                if (phase == buyerPhase.FREEZE_PO) {
                    _payToSupplier(i);
                }
                // update the phase
                buyerPO[i].buyerStatus = phase;
                break;
            }
        }
    }

    function updateSupplierPhase(
        supplierPhase phase,
        uint256 id,
        address addr
    ) public onlySupplier {
        // loop over the buyerPO array
        for (uint256 i = 0; i < buyerPO.length; i++) {
            // if the id matches
            if (buyerPO[i].id == id && buyerPO[i].buyer == addr) {
                // update the phase
                buyerPO[i].supplierStatus = phase;
                break;
            }
        }
    }

    // function to pay to the supplier
    function _payToSupplier(uint256 idx) public payable onlyBuyer {
        // get the price
        uint256 price = buyerPO[idx].price;
        // send the ether to the supplier
        payable(supplier).transfer(price);
    }

    // initial function to raise the purchase order
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
