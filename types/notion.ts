import { Collection, ExtendedRecordMap, BlockType } from "notion-types";
export type * from "notion-types";

export interface ExtendedCollection extends Collection {
  description: [[string]];
  cover: string;
}

export interface Page {
  id: string;
  title: string;
  summary?: string;
  date: number;
  lastEditedTime: number;
  type: PageType | null;
  status: PageStatus | null;
  slug: string;
  pageCover: string;
  pageCoverThumbnail: string;
  tags: string[];
  blockMap?: ExtendedRecordMap; // 实际的页面内容
  toc?: TableOfContentsEntry[];
  searchResults?: string[]; // 用于搜索页面匹配keyword
}

export enum PageType {
  Post = "Post",
  // 普通页面不是博文
  Page = "Page",
  Config = "Config",
  // HeadMenu
  //  ├── Menu
  //  │   ├── Menu
  //  │   ├── Page
  //  │   └── Link
  //  ├── Link
  //  └── Page
  HeadMenu = "HeadMenu",
  Link = "Link",
  Menu = "Menu",
}

export enum PageStatus {
  Published = "Published",
  Invisible = "Invisible",
  Draft = "Draft",
}

export enum PagePropertyName {
  Type = "type",
  Title = "title",
  Status = "status",
  Tags = "tags",
  Slug = "slug",
  Date = "date",
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  count: number;
}

export interface TableOfContentsEntry {
  id: string;
  type: BlockType;
  text: string;
  indentLevel: number;
}
