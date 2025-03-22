import blogConfig from "@/blog.config";
import { Block } from "@/types/notion";
import { ExtendedCollection } from "@/types/notion";

export const NOTION_HOST = "https://www.notion.so";

export function mapImgUrl(
  imgUrl: string | undefined,
  block: Block | ExtendedCollection,
  type: string = "block",
  needCompress: boolean = true
) {
  if (!imgUrl) return "";

  let result = "";

  // 相对路径，则视为notion的自带图片
  if (imgUrl.startsWith("/")) {
    result = `${NOTION_HOST}${imgUrl}`;
  } else {
    result = imgUrl;
  }

  const hasConverted =
    result.indexOf("https://www.notion.so/image") === 0 ||
    result.includes("notion.site/images/page-cover/");

  // 需要转化的URL ; 识别aws图床地址，或者bookmark类型的外链图片
  // Notion新图床资源 格式为 attachment:${id}:${name}
  const needConvert =
    (!hasConverted &&
      ((block as Block).type === "bookmark" ||
        result.includes("secure.notion-static.com") ||
        result.includes("prod-files-secure"))) ||
    result.indexOf("attachment") === 0;

  // 如果是Notion旧图床
  if (needConvert) {
    result =
      NOTION_HOST +
      "/image/" +
      encodeURIComponent(result) +
      "?table=" +
      type +
      "&id=" +
      block.id;
  }

  if (needCompress) {
    const width = block?.format?.block_width;
    result = compressImage(result, width);
  }

  return result;
}

export function compressImage(
  imgUrl: string,
  width: number = blogConfig.IMAGE_COMPRESS_WIDTH,
  quality: number = 50,
  format: string = "webp"
) {
  if (!imgUrl || imgUrl.indexOf("http") !== 0) {
    return imgUrl;
  }

  if (imgUrl.includes(".svg")) return imgUrl;

  // 将URL解析为一个对象
  const urlObj = new URL(imgUrl);
  // 获取URL参数
  const params = new URLSearchParams(urlObj.search);

  // Notion图床
  if (
    imgUrl.indexOf(NOTION_HOST) === 0 &&
    imgUrl.indexOf("amazonaws.com") > 0
  ) {
    params.set("width", width.toString());
    params.set("cache", "v2");
    // 生成新的URL
    urlObj.search = params.toString();
    return urlObj.toString();
  } else if (imgUrl.indexOf("https://images.unsplash.com/") === 0) {
    // 压缩unsplash图片
    // 将q参数的值替换
    params.set("q", quality.toString());
    // 尺寸
    params.set("width", width.toString());
    // 格式
    params.set("fmt", format);
    params.set("fm", format);
    // 生成新的URL
    urlObj.search = params.toString();
    return urlObj.toString();
  } else if (imgUrl.indexOf("https://your_picture_bed") === 0) {
    // 此处还可以添加您的自定义图传的封面图压缩参数。
    // .e.g
    return "do_somethin_here";
  }

  return imgUrl;
}
