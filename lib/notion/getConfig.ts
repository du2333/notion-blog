import { getTextContent } from "notion-utils";

import defaultConfig from "@/blog.config";
import { getPostBlocks } from "@/lib/notion/getPostBlocks";
import { getPageIdsInCollection } from "@/lib/notion/getPageIds";
import { mapImgUrl } from "@/utils/imgProcessing";
import { Decoration } from "@/types/notion";
import { BlogConfig } from "@/types/config";

/**
 * 从 Notion 属性中提取文件/图片 URL
 */
function getFileValue(property: unknown): string {
  if (!property || !Array.isArray(property)) {
    return "";
  }
  // 文件属性格式可能是: [[url]] 或 [[filename, [[a, url]]]]
  const firstItem = property[0];
  if (Array.isArray(firstItem)) {
    // 检查是否有嵌套的链接
    if (firstItem[1] && Array.isArray(firstItem[1])) {
      const link = firstItem[1].find(
        (item: unknown) => Array.isArray(item) && item[0] === "a"
      );
      if (link && link[1]) {
        return link[1];
      }
    }
    return firstItem[0] || "";
  }
  return "";
}

export async function getConfig(configPageId: string | null) {
  if (!configPageId) return defaultConfig;

  // 获取配置页面内容，里面应该有一个Table View的Database
  const configRecordMap = await getPostBlocks(configPageId);
  if (!configRecordMap) return defaultConfig;
  const configBlockMap = configRecordMap.block;
  const { content } = configBlockMap[configPageId].value;

  if (!content) return defaultConfig;

  // 获取配置表格ID
  const configTableId = content.find((contentId) => {
    return configBlockMap[contentId].value.type === "collection_view";
  });

  if (!configTableId) return defaultConfig;

  // 获取配置表格内容
  const configBlock = configBlockMap[configTableId].value;

  if (
    configBlock.type !== "collection_view" &&
    configBlock.type !== "collection_view_page"
  ) {
    console.error(`页面ID: ${configPageId}不是一个数据库`);
    return defaultConfig;
  }

  // 获取配置表格的Collection ID和表格的Schema
  const collectionId = configBlock.collection_id as string;
  const { schema } = configRecordMap.collection[collectionId].value;

  // 获取所有配置项的ID
  const configIds = getPageIdsInCollection(
    collectionId,
    configRecordMap.collection_query,
    configRecordMap.collection_view,
    configBlock.view_ids
  );

  const config: Partial<BlogConfig> = {};

  // 找到 file 类型列的 schema key
  let fileColumnKey: string | null = null;
  for (const [key, schemaItem] of Object.entries(schema)) {
    if ((schemaItem as { type?: string }).type === "file") {
      fileColumnKey = key;
      break;
    }
  }

  // 遍历所有配置项，获取配置项的值
  configIds.forEach((id) => {
    const block = configBlockMap[id].value;
    const { properties } = block;
    const tempConfigItem: {
      name: string;
      value: string;
      type: string;
      fileValue: string;
    } = {
      name: "",
      value: "",
      type: "",
      fileValue: "",
    };

    /**
     * Decoration 富文本
     * type Decoration = BaseDecoration | AdditionalDecoration;
     *
     * type BaseDecoration = [string]; // 例如：["纯文本"]
     *
     * type AdditionalDecoration = [string, SubDecoration[]]; // 例如：["文本", [格式1, 格式2]]
     *
     * ["This is plain text"] 基础文本
     * ["Bold & Italic", [['b'], ['i']]] 带格式文本
     * ["Visit Notion", [['a', 'https://notion.so'], ['h', 'blue']]] 带链接和颜色的文本
     */
    Object.entries<Decoration[]>(properties).forEach(([key, value]) => {
      if (!schema[key]) return;
      // 配置项名称
      const { name } = schema[key];
      // 获取未格式化的文本内容
      const content = getTextContent(value);

      // 如果配置项名称是name、value、type(这里是写死的)，则直接赋值
      if (name === "name" || name === "value" || name === "type") {
        tempConfigItem[name] = content;
      }

      // 如果是 file 类型列，提取文件 URL
      if (key === fileColumnKey) {
        tempConfigItem.fileValue = getFileValue(value);
      }
    });

    const { name, value: rawValue, type, fileValue } = tempConfigItem;

    let value;

    switch (type) {
      case "String":
        value = rawValue;
        break;

      case "Boolean":
        value = rawValue.toLowerCase() === "true";
        break;

      case "Number":
        value = parseFloat(rawValue);
        if (isNaN(value)) {
          console.warn(`配置项${name}的值${rawValue}不是一个数字`);
        }
        break;

      case "JSON":
        try {
          value = JSON.parse(rawValue);
        } catch (error) {
          console.error(`配置项${name}的值${rawValue}JSON解析失败, ${error}`);
        }
        break;

      case "File":
        // 从 file 类型列获取图片 URL，使用 mapImgUrl 转换
        if (fileValue) {
          value = mapImgUrl(fileValue, block, "block", false);
        }
        break;

      default:
        console.warn(`配置项${name}的类型${type}不支持`);
        break;
    }

    config[name as keyof BlogConfig] = value;
  });

  // 合并默认配置和获取的配置
  return {
    ...defaultConfig,
    ...config,
  };
}
