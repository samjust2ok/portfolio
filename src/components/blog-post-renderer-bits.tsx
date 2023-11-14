"use client";

import { useMemo, useRef } from "react";
import {
  Sandpack,
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import {
  getAttributeValue,
  getHTMLPreElementContent,
} from "../app/utilities/helpers";
import { Icon } from "./icon";
import classNames from "classnames";
import { useCopyToClipboard } from "../app/utilities/hooks";
import { ScrollArea } from "./scroll-area";

interface RenderElementProps {
  content: string;
}

export function Sandbox({ content }: RenderElementProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { template, files, asDisplay } = useMemo(() => {
    const configKey = "/sandbox.config.json";
    const c = getHTMLPreElementContent(content);
    const parsedContent = JSON.parse(c);
    const { editable, asDisplay } = JSON.parse(
      parsedContent.files?.[configKey]?.code ?? {}
    );
    delete parsedContent.files?.[configKey];
    const { template, files } = parsedContent;
    Object.keys(files).forEach((key) => {
      files[key].readOnly = !editable;
    });
    return { template, files, asDisplay };
  }, [content]);

  const options = {
    files,
    template,
  };

  const theme = {
    colors: {
      surface1: "#121212",
      surface2: "#1a1a1a",
      surface3: "#2F2F2F",
      clickable: "#999999",
      base: "#9a9a9a",
      disabled: "#4D4D4D",
      hover: "#C5C5C5",
      accent: "#dcdcdc",
      error: "#ff453a",
      errorSurface: "#ffeceb",
    },
    syntax: {
      plain: "#FFFFFF",
      comment: {
        color: "#8da1b9",
        fontStyle: "italic",
      },
      keyword: "#e9ae7e",
      tag: "#66cccc",
      punctuation: "#ffffff",
      definition: "#6cb8e6",
      property: "#c699e3",
      static: "#FF453A",
      string: "#91d076",
    },
    font: {
      mono: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
      size: "12px",
    },
  } as any;

  if (asDisplay)
    return (
      <SandpackProvider {...options} theme={theme}>
        <SandpackLayout>
          <SandpackPreview showOpenInCodeSandbox={!asDisplay} />
        </SandpackLayout>
      </SandpackProvider>
    );

  return (
    <div
      ref={containerRef}
      className="Sandpack-code-preview-container relative"
    >
      <Sandpack
        {...options}
        options={{
          initMode: "user-visible",
          initModeObserverOptions: { rootMargin: "100px 0px" },
          resizablePanels: false,
        }}
        theme={theme}
      />
      <button
        title="Toggle code or preview section"
        onClick={() =>
          containerRef.current?.classList.toggle("show-display-only")
        }
        className="code-display-toggle flex items-center justify-center absolute h-7 w-7 bottom-2.5 right-2 rounded-full bg-secondary-color lg:hidden"
      >
        <Icon icon="monitor" className="h-3 w-3" />
        <Icon icon="code" className="h-3 w-3" />
      </button>
    </div>
  );
}

export function Codeblock({ content }: RenderElementProps) {
  const language = useMemo(() => {
    const language = getAttributeValue(content, "class");
    return language?.split("-")[1];
  }, [content]);

  const codeRef = useRef("");

  const [copied, onCopy] = useCopyToClipboard(3000);

  return (
    <div className="Code-snippet flex flex-col z-1">
      <div className="flex justify-between items-center border-b border-border-color py-2 px-3">
        <div className="flex items-center gap-x-3">
          <div className="Apple-indicators flex items-center gap-x-1">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p className="text-xs font-outfit">{language}</p>
        </div>
        <button
          disabled={copied}
          onClick={() => onCopy(codeRef.current)}
          className="btn-subtle text-xs font-outfit"
        >
          <Icon
            icon={copied ? "check" : "copy"}
            className={classNames("h-3 w-3", { "text-green-400": copied })}
          />
          &nbsp; {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <ScrollArea>
        <div
          ref={(r) => (codeRef.current = r?.innerText || "")}
          className="py-2 px-3 max-h-[300px]"
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      </ScrollArea>
    </div>
  );
}

export function Markup({ content }: RenderElementProps) {
  return <div dangerouslySetInnerHTML={{ __html: content }}></div>;
}
