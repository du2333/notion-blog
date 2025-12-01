"use client";

import { getBlockTitle } from "notion-utils";
import { useNotionContext, Text } from "react-notion-x";
import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { Copy, Check } from "lucide-react";

import { CodeBlock } from "@/types/notion";
import { codeToHtml } from "shiki";
import { Button } from "@/components/ui/button";

export function Code({ block }: { block: CodeBlock }) {
  const { recordMap } = useNotionContext();
  const [html, setHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);

  const content = getBlockTitle(block, recordMap);
  const language = useMemo(() => {
    const languageNotion = (
      block.properties?.language?.[0]?.[0] || "javascript"
    ).toLowerCase();

    switch (languageNotion) {
      case "c++":
        return "cpp";
      case "f#":
        return "fsharp";
      default:
        return languageNotion;
    }
  }, [block]);

  const caption = block.properties.caption;

  const handleCopy = useCallback(() => {
    // 从 HTML 中获取纯文本内容
    const codeElement = codeRef.current?.querySelector("code");
    let textToCopy = content;

    // 如果能找到渲染后的代码元素，则从中提取文本
    if (codeElement) {
      textToCopy = codeElement.textContent || content;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [content, codeRef]);

  useEffect(() => {
    const renderCode = async () => {
      setIsLoading(true);
      try {
        const renderedHtml = await codeToHtml(content, {
          lang: language,
          themes: {
            light: "material-theme-lighter",
            dark: "material-theme-ocean",
          },
          defaultColor: "light",
          cssVariablePrefix: "--shiki-",
        });
        setHtml(renderedHtml);
      } catch (error) {
        console.error("Error rendering code:", error);
        setHtml(
          `<pre class="p-4 bg-gray-100 dark:bg-gray-800 rounded overflow-auto"><code>${escapeHtml(
            content
          )}</code></pre>`
        );
      } finally {
        setIsLoading(false);
      }
    };

    renderCode();
  }, [content, language]);

  if (isLoading) {
    return (
      <div className="w-full p-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
    );
  }

  return (
    <div className="relative group notion-code-block" ref={codeRef}>
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button
          onClick={handleCopy}
          variant="ghost"
          className="flex items-center justify-center size-12 rounded bg-muted focus:outline-none focus:ring-2 focus:ring-primary backdrop-blur-sm"
          aria-label={copied ? "Copied!" : "Copy code"}
          title={copied ? "Copied!" : "Copy code"}
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </Button>
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />

      {caption && (
        <figcaption className="notion-asset-caption">
          <Text value={caption} block={block} />
        </figcaption>
      )}
    </div>
  );
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
