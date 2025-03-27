"use client";

import { EquationBlock } from "@/types/notion";
import { useNotionContext } from "react-notion-x";
import { useState, useEffect } from "react";
import { getBlockTitle } from "notion-utils";
import KaTeX from "katex";
import "katex/contrib/mhchem";

export function Equation({
  block,
  math,
  inline = false,
  className,
}: {
  block: EquationBlock;
  math?: string;
  inline?: boolean;
  className?: string;
}) {
  const { recordMap } = useNotionContext();
  math = math || getBlockTitle(block, recordMap);

  const [state, setState] = useState({ innerHtml: "" });

  useEffect(() => {
    try {
      const innerHtml = KaTeX.renderToString(math, {
        displayMode: true,
        throwOnError: false,
        strict: false,
      });
      setState({ innerHtml });
    } catch (error) {
      if (error instanceof KaTeX.ParseError || error instanceof TypeError) {
        setState({ innerHtml: error.message });
      } else {
        throw error;
      }
    }
  }, [math]);

  return (
    <span
      role="button"
      tabIndex={0}
      className={`notion-equation ${
        inline ? "notion-equation-inline" : "notion-equation-block"
      } ${className}`}
      dangerouslySetInnerHTML={{ __html: state.innerHtml }}
    />
  );
}
