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

    modifier validBuyerPhase(buyerPhase phase){
        require(state == phase);
        _;
    }

    modifier validSupplierPhase(buyerPhase phase){
        require(state == phase);
        _;
    }


    modifier onlyBuyer() {
        require(
            msg.sender != supplier && poList[msg.sender].length > 0,
            "Only the authorized buyer can call this function"
        );
        _;
    }


   function changeBuyerState(buyerPhase x) public{
       if(msg.sender == supplier)
        revert();
       if(x < state)
        revert();
       state = x;
   }

   function changeSupplierState(supplierPhase x) public{
       if(msg.sender != supplier)
        revert();
       if(x < state)
        revert();
       state = x;
   }

   function addPO(product p) validBuyerPhase(buyerPhase.RAISE_PO){
       if(msg.sender == supplier) revert();
       poList[msg.sender].push(p);
   }

   function removePO(product p) validBuyerPhase(buyerPhase.WITHDRAW_PO){
       if(msg.sender == supplier || poList[msg.sender].length == 0) revert();
       for( unit i = 0; i < poList[msg.sender].length; i++){
           if(poList[msg.sender][i] == p){
               delete poList[msg.sender][i];
           }
       }
   }

   function payment(product p) validBuyerPhase(buyerPhase.FREEZE_PO){
       if(msg.sender == supplier || poList[msg.sender].length == 0) revert();
   }
}