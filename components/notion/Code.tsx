"use client";

import "prismjs";
import "prismjs/plugins/autoloader/prism-autoloader";
import "prismjs/plugins/toolbar/prism-toolbar";
import "prismjs/plugins/toolbar/prism-toolbar.min.css";
import "prismjs/plugins/show-language/prism-show-language";
import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard";
import "prismjs/plugins/line-numbers/prism-line-numbers";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import Prism from "prismjs";

import { getBlockTitle } from "notion-utils";
import { useNotionContext, Text } from "react-notion-x";
import { useEffect, useMemo, useRef } from "react";

import { CodeBlock } from "@/types/notion";
import Script from "next/script";

const MERMAID_CDN =
  "https://cdnjs.cloudflare.com/ajax/libs/mermaid/11.4.0/mermaid.min.js";
const PRISM_JS_LANGUAGE_PATH =
  "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/";

Prism.plugins.autoloader.languages_path = PRISM_JS_LANGUAGE_PATH;

export function Code({ block }: { block: CodeBlock }) {
  const { recordMap } = useNotionContext();

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

  const codeRef = useRef(null);
  useEffect(() => {
    if (codeRef.current) {
      try {
        Prism.highlightElement(codeRef.current);
      } catch (err) {
        console.warn("prismjs highlight error", err);
      }
    }
  }, [codeRef]);

  const handleMermaidOnReady = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).mermaid?.contentLoaded();
  };

  return (
    <>
      <div className="w-full">
        <pre
          className={`notion-code line-numbers language-${language}`}
          style={{
            whiteSpace: "pre-wrap",
          }}
        >
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <code ref={codeRef as any}>{content}</code>
          {language === "mermaid" && <div className="mermaid">{content}</div>}
        </pre>
      </div>

      {caption && (
        <figcaption className="notion-asset-caption">
          <Text value={caption} block={block} />
        </figcaption>
      )}
      {language === "mermaid" && (
        <Script src={MERMAID_CDN} onReady={handleMermaidOnReady} />
      )}
    </>
  );
}
