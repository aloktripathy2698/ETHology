import { MODE_DEBUG } from "../constants";
import { ISearchRequest } from "../interfaces/interface";
import { SEARCH_ENDPOINT } from "./constants";

const getSearchResults = async (props: ISearchRequest) => {
  const url = SEARCH_ENDPOINT;
  MODE_DEBUG && console.log("[getSearchResults] Looking for local DB");
  const db = await fetch(url);
  const data = await db.json();
  MODE_DEBUG && console.log("[getSearchResults] data: ", data);

  return { data, count: data.length };
};

const getLocalDbData = async () => {
  const url = SEARCH_ENDPOINT;
  MODE_DEBUG && console.log("[getSearchResults] Looking for local DB");
  const db = await fetch(url);
  const data = await db.json();
  MODE_DEBUG && console.log("[getSearchResults] data: ", data);
  return data;
};

export { getSearchResults, getLocalDbData };
