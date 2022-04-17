// List of all the labels and the constants used in the app

export const APP_NAME = "Ethology";
export const PRODUCT_DETAILS_LABEL = "Product Details";
export const PRODUCT_STATUS_LABEL = "Product Status";
export const LABEL_DASHBOARD = "Dashboard";
export const BUYER_PHASE_MAPPING: Record<string, string> = {
  "0": "Raise PO",
  "1": "Freeze PO",
  "2": "Withdraw PO",
};
export const SUPPLIER_PHASE_MAPPING: Record<string, string> = {
  "0": "Approve PO",
  "1": "Procure PO",
  "2": "Deliver PO",
};
