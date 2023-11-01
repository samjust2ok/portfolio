"use client";
import { useMemo } from "react";
import { generateSplit, getAttributeValue } from "../utilities/helpers";
import { Sandbox, Codeblock, Markup } from "./blog-post-renderer-bits";

interface RendererProps {
  content: string;
}

const BlogPostRenderer = ({ content }: RendererProps) => {
  const contents = useMemo(() => generateSplit(content), [content]);

  return (
    <div className="blog-post-content">
      {contents.map((content, i) => {
        const dataType = getAttributeValue(content, "data-type");
        if (dataType === "sandbox")
          return (
            <div key={i} className="Custom-block-element Sandbox-element">
              <Sandbox key={i} content={content} />
            </div>
          );
        if (dataType === "code-block")
          return (
            <div key={i} className="Custom-block-element">
              <Codeblock key={i} content={content} />
            </div>
          );
        return <Markup key={i} content={content} />;
      })}
    </div>
  );
};

export default BlogPostRenderer;
