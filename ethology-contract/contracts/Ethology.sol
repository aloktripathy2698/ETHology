pragma solidity >=0.4.22 <0.9.0;

// contract for healthcare marketplace
contract Ethology {
    // structs for representing the data
    struct product {
        uint256 id;
        uint256 quantity;
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

   function addPO(uint256 productID, uint256 price) validBuyerPhase(buyerPhase.RAISE_PO){
       if(msg.sender == supplier || poList[msg.sender].productInfo == p) revert();
       //poList[msg.sender].push(p);
    //    if (poList[msg.sender] != 0){
    //        for( uint i = 0; i < poList[msg.sender].length; i++){
    //            if (i.productInfo.id == p.id){
    //                i.productInfo.quantity++;
    //            }
    //        }

        //Created purchase order object.
        purchaseOrder po;

        // Updated buyer and supplier status.
        po.buyerStatus = buyerPhase.RAISE_PO;
        po.supplierStatus = supplierPhase.PROCURED;
        
        // Created product object.
        product p;
        p.id = productID;
        p.price = price;

        // Updated product info.
        po.productInfo = p;

        // Added product object into poList.
        poList[msg.sender].push(po);
   }

   function removePO(uint256 productID, uint256 price) validBuyerPhase(buyerPhase.WITHDRAW_PO){
       if(msg.sender == supplier || poList[msg.sender].length == 0) revert();
       for( unit i = 0; i < poList[msg.sender].length; i++){
           if(poList[msg.sender][i].productInfo.id == productID && poList[msg.sender][i].productInfo.price == price){
               poList[msg.sender][i].buyerStatus = WITHDRAW_PO;
           }
       }
   }

   function payment(uint256 productID, uint256 price) validBuyerPhase(buyerPhase.FREEZE_PO){
       if(msg.sender == supplier || poList[msg.sender].length == 0) revert();
       for( unit i = 0; i < poList[msg.sender].length; i++){
           if(poList[msg.sender][i].productInfo.id == productID && poList[msg.sender][i].productInfo.price == price){
               poList[msg.sender][i].buyerStatus = FREEZE_PO;
           }
       }
   }
}