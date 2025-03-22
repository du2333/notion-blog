"use client";

import { NotionComponents, NotionRenderer } from "react-notion-x";
import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

import { Page } from "@/types/notion";
import { mapImgUrl } from "@/utils/imgProcessing";

export function NotionPage({ post }: { post: Page }) {
  // TODO: useTheme()
  const isDarkMode = true;

  const components = useMemo<Partial<NotionComponents>>(
    () => ({
      nextLegacyImage: Image,
      nextLink: Link,
      // TODO: 添加代码块高亮
    }),
    []
  );

  return (
    post &&
    post.blockMap && (
      <div id="notion-article" className="mx-auto overflow-x-hidden">
        <NotionRenderer
          recordMap={post.blockMap}
          darkMode={isDarkMode}
          mapImageUrl={mapImgUrl}
          previewImages={!!post.blockMap.preview_images}
          showTableOfContents={true}
          components={components}
        />
      </div>
    )
  );
}
