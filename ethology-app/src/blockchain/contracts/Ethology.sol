// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <=0.9.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// contract for healthcare marketplace
contract Ethology is ERC20 {
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

    struct balance {
        address addr;
        uint256 balance;
    }

    // map representing the products the client has ordered
    mapping(address => purchaseOrder[]) poList;
    mapping(address => uint256) balances;

    // owner of the contract
    address supplier;
    uint256 buyerCount;
    purchaseOrder[] buyerPO;

    // constructor
    constructor() payable ERC20("Ethology", "HETH") {
        supplier = msg.sender;
        _mint(supplier, 1000000*10**18);
        // payable(supplier).transfer(msg.value);
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

    function getBalance() public view onlySupplier returns (uint256) {
        return balances[msg.sender];
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

    function getBuyerBalance() public view returns (uint256) {
        return balances[msg.sender];
    }

    // function to pay to the supplier
    function initiatePayment(uint256 idx)
        public
        payable
        onlyBuyer
        returns (bool)
    {
        require(msg.value > 1 ether, "Payment must be greater than 1 ether");
        require(msg.value >= msg.sender.balance, "Insufficient balance");
        // get the price
        uint256 toPay = buyerPO[idx].price;
        // add an assert as well
        // send the ether to the supplier
        balances[supplier] += balances[address(this)] - toPay;
        return true;
    }

    // function for payment to the seller
    function payInHETH(address contractAddress, uint256 amount) payable public onlyBuyer {
        IERC20 token = IERC20(contractAddress);        
        // check if the amount is greater than the balance
        require(token.allowance(msg.sender, supplier) >= amount, "Insufficient balance");
        // transfer the amount to the supplier
        require(token.transferFrom(msg.sender, supplier, amount), "HETH Transfer failed");
        // token.transferFrom(msg.sender, supplier, amount);
        // update the balance
        emit Transfer(msg.sender, supplier, amount);
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
