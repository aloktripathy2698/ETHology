// This file contains all the interfaces used in the application

import React from "react";
import Web3 from "web3";

export interface IRootView {
  root: JSX.Element;
  hideFilter?: boolean;
  viewName?: string;
  currentAccount?: string;
}

export interface ISearchField {
  value: string;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
      | React.SyntheticEvent<Element, Event>,
    value: string
  ) => void;
  options?: string[];
}

export interface ISearchResult {
  title: string;
  subtitle: string;
  annotation: ITextAnnotation;
  routeToWeb?: boolean;
}

export interface IPaginate {
  page: number;
  perPage: number;
  total: number;
  handlePageChange: (event: any, page: number) => void;
  handlePerPageChange: (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  showPagination?: boolean;
}

export interface ISearchResultResponse {
  _version_?: string;
  manufac_name?: string;
  availability?: string;
  mentions?: string[];
  country: string;
  id: string;
  listing_date: string;
  listing_lang: string;
  listing_text: string;
  verified: boolean;
}

export interface IFilterMenu {
  filterName: string;
  handleFilterChange: (
    filterName: string,
    name: string,
    checked: boolean
  ) => void;
  title: string;
  options: Array<{ name: string; value: string; checked: boolean }>;
}

export interface ICheckboxWithTitle {
  title: string;
  name: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ITextAnnotation {
  country?: string;
  time?: string;
  verified?: boolean;
  manufac_name?: string;
  availability?: string;
  id?: string;
  manufac_id?: string;
  sentiment_score?: number;
  price?: number;
}

export interface ISearchRequest {
  query: string;
  filters: { pois: string[]; language: string[]; country: string[] };
  page_number: number;
  rows_per_page: number;
}
export interface ISearchResultDetails {
  productId?: string;
  poiName?: string;
}

export interface INoResultProps {
  title: string;
  mainResults?: boolean;
}

export interface IPOIStatsProps {
  poi: string;
  country: string;
}

export interface IGenericCard {
  children: JSX.Element;
}

export interface IDashboardProps {
  currentAccount: string;
}

export interface IProgressStepper {
  steps: Array<string>;
  isOwner: boolean;
  id: string;
  price: string;
  account: string;
  buyerStatus: string;
  supplierStatus: string;
}

export interface IAlertDialog {
  header: string;
  message: string;
  open: boolean;
  btn1: string;
  btn2: string;
}
