import { Collection, ExtendedRecordMap } from "notion-types";

export interface ExtendedCollection extends Collection {
  description: [[string]];
  cover: string;
}

export interface Page {
  id: string;
  blockMap?: ExtendedRecordMap;
}
