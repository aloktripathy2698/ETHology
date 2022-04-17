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
    }

    // map representing the products the client has ordered
    mapping(address => purchaseOrder[]) poList;
    uint256[] PoIdList;
    uint256[] PoPriceList;
    supplierPhase[] PoSupplierStatusList;
    buyerPhase[] PoBuyerStatusList;
    address[] PoBuyerAddressList;

    // owner of the contract
    address supplier;
    uint256 buyerCount = 0;

    // address[] addresses;
    // buyerPhase[] buyerPhases;

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
            "Only the buyer can call this function"
        );
        _;
    }

    modifier validateBuyerPhase(buyerPhase phase) {
        uint256 idx = getBuyerIndex(msg.sender);
        require(phase > PoBuyerStatusList[idx], "Invalid phase");
        _;
    }

    modifier validateSupplierPhase(supplierPhase phase, uint256 idx) {
        require(phase > PoSupplierStatusList[idx], "Invalid phase");
        _;
    }

    // utility functions
    function getSupplier() public view returns (address) {
        return supplier;
    }

    function getBuyer() public view returns (address) {
        return msg.sender;
    }

    function getPoIdList() public view returns (uint256[] memory) {
        return PoIdList;
    }

    function getPoPriceList() public view returns (uint256[] memory) {
        return PoPriceList;
    }

    function getPoSupplierStatusList()
        public
        view
        returns (supplierPhase[] memory)
    {
        return PoSupplierStatusList;
    }

    function getPoBuyerStatusList() public view returns (buyerPhase[] memory) {
        return PoBuyerStatusList;
    }

    function getPoBuyerAddressList() public view returns (address[] memory) {
        return PoBuyerAddressList;
    }

    function getPOList() public view returns (purchaseOrder[] memory) {
        return poList[msg.sender];
    }

    function getBuyerIndex(address addr) public view returns (uint256) {
        for (uint256 i = 1; i <= buyerCount; i++) {
            if (addr == PoBuyerAddressList[i - 1]) {
                return i;
            }
        }
        return 0;
    }

    function getBuyerCount() public view returns (uint256) {
        return buyerCount;
    }

    function isPoAlreadyRaised(uint256 id) public view returns (bool) {
        uint256 currentUserIdx = getBuyerIndex(msg.sender);
        if (currentUserIdx == 0) {
            return false;
        }
        return PoIdList[currentUserIdx - 1] == id;
    }

    // function to add a product to the marketplace
    function raisePO(uint256 id, uint256 price) public onlyBuyer {
        if (!isPoAlreadyRaised(id)) {
            PoBuyerAddressList.push(msg.sender);
            PoIdList.push(id);
            PoPriceList.push(price);
            PoBuyerStatusList.push(buyerPhase.RAISE_PO);
            PoSupplierStatusList.push(supplierPhase.INIT);
            buyerCount++;
        } else {
            revert("PO already raised");
        }
    }

    function updateSupplierPhase(supplierPhase phase) public onlySupplier {
        uint256 currentUserIdx = getBuyerIndex(msg.sender);
        if (currentUserIdx == 0) {
            revert("No PO raised by this user");
        }
        PoSupplierStatusList[currentUserIdx - 1] = phase;
    }

    function updateBuyerPhase(buyerPhase phase) public onlyBuyer {
        uint256 currentUserIdx = getBuyerIndex(msg.sender);
        if (currentUserIdx == 0) {
            revert("No PO raised by this user");
        }
        PoBuyerStatusList[currentUserIdx - 1] = phase;
    }

    // ideally how it should be
    function RaisePo(uint256 id, uint256 price) public {
        poList[msg.sender].push(
            purchaseOrder({
                buyerStatus: buyerPhase.RAISE_PO,
                supplierStatus: supplierPhase.INIT,
                price: price,
                id: id
            })
        );
    }
}
