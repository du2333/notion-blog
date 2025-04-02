"use client";

import { NotionComponents, NotionRenderer } from "react-notion-x";
import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

import { Page } from "@/types/notion";
import { mapImgUrl } from "@/utils/imgProcessing";
import dynamic from "next/dynamic";

const Code = dynamic(() => import("./Code").then((m) => m.Code), {
  ssr: false,
});
const Collection = dynamic(
  () =>
    import("react-notion-x/build/third-party/collection").then(
      (m) => m.Collection
    ),
  {
    ssr: true,
  }
);
const Equation = dynamic(() => import("./Equation").then((m) => m.Equation), {
  ssr: false,
});
const Pdf = dynamic(() => import("./Pdf").then((m) => m.Pdf), {
  ssr: false,
});
const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  {
    ssr: false,
  }
);

export function NotionPage({ post }: { post: Page }) {
  // TODO: useTheme()
  const isDarkMode = false;

  const components = useMemo<Partial<NotionComponents>>(
    () => ({
      nextLegacyImage: Image,
      nextLink: Link,
      Code,
      Collection,
      Equation,
      Pdf,
      Modal,
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
          components={components}
        />
      </div>
    )
  );
}
