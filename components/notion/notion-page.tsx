"use client";

import { NotionComponents, NotionRenderer } from "react-notion-x";
import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

import { Page } from "@/types/notion";
import { mapImgUrl } from "@/utils/imgProcessing";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import useMount from "@/hooks/useMount";

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
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const mounted = useMount();

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
    mounted &&
    post &&
    post.blockMap && (
      <NotionRenderer
        recordMap={post.blockMap}
        darkMode={isDarkMode}
        mapImageUrl={mapImgUrl}
        previewImages={!!post.blockMap.preview_images}
        components={components}
      />
    )
  );
}
