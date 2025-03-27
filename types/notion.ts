import { Block, Collection, ExtendedRecordMap } from "notion-types";
export type * from "notion-types";

import { BlogConfig } from "@/types/config";

export interface ExtendedCollection extends Collection {
  description: [[string]];
  cover: string;
}

export interface Page {
  id: string;
  title: string;
  date: number;
  lastEditedTime: number;
  type: PageType | null;
  status: PageStatus | null;
  slug: string;
  content: string[];// 用于搜索
  icon: string; // 作为导航栏的icon
  pageCover: string;
  pageCoverThumbnail: string;
  tags: string[];
  blockMap?: ExtendedRecordMap; // 实际的页面内容

  parentId?: string | null;
  childrenIds?: string[] | null;
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
  Icon = "icon",
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  count: number;
}

export interface Nav {
  id: string;
  icon: string;
  to: string;
  show: boolean;
  title: string;
  subMenus?: Nav[];
  type: PageType;
}

export interface Site {
  id: string;
  siteInfo: SiteInfo;
  allPages: Page[];
  block: Block;
  tagOptions: Tag[];
  navList: Nav[];
  publishedPosts: Page[];
  latestPosts: Page[];
  config: BlogConfig;
}

export interface SiteInfo {
  title: string;
  description: string;
  pageCover: string;
  icon: string;
}
