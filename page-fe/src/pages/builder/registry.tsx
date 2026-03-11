/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { LayoutNode } from "@/types/block";

type RenderCtx = {
  renderChildren: (node: LayoutNode) => React.ReactNode;
};

export const registry: Record<
  string,
  {
    isContainer?: boolean;
    render: (node: LayoutNode, ctx: RenderCtx) => React.ReactNode;
  }
> = {
  paragraph: {
    render: (node) => (
      <p style={{ margin: "8px 0" }}>{node.props.text ?? ""}</p>
    ),
  },

  list: {
    render: (node) => {
      const ordered = !!node.props.ordered;
      const items = String(node.props.itemsText ?? "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const Tag = ordered ? ("ol" as any) : ("ul" as any);
      return (
        <Tag style={{ paddingLeft: 18, margin: "8px 0" }}>
          {items.map((it: string, idx: number) => (
            <li key={idx}>{it}</li>
          ))}
        </Tag>
      );
    },
  },
  header: {
    isContainer: true,
    render: (node, { renderChildren }) => (
      <header
        style={{
          border: "1px dashed #bbb",
          borderRadius: 10,
          padding: 12,
          marginBottom: 12,
        }}
      >
        <b>HEADER</b> (click trong Structure để mở Header Builder)
        <div style={{ marginTop: 10 }}>{renderChildren(node)}</div>
      </header>
    ),
  },
  table: {
    render: (node) => (
      <div style={{ padding: 12, border: "1px dashed #ccc", borderRadius: 10 }}>
        <b>Table</b> (CSV)
        <pre style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>
          {String(node.props.csv ?? "")}
        </pre>
      </div>
    ),
  },

  gallery: {
    render: (node, { renderChildren }) => {
      const cols = Number(node.props.cols ?? 3);
      const urls = String(node.props.imagesText ?? "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gap: 10,
          }}
        >
          {urls.map((u: string, i: number) => (
            <img key={i} src={u} style={{ width: "100%", borderRadius: 10 }} />
          ))}
          {renderChildren
            ? renderChildren({ ...(node as any), children: [] })
            : null}
        </div>
      );
    },
  },

  video: {
    render: (node) => (
      <div style={{ padding: 12, border: "1px dashed #ccc", borderRadius: 10 }}>
        <b>Video</b>: {String(node.props.url ?? "")}
      </div>
    ),
  },
  audio: {
    render: (node) => (
      <div style={{ padding: 12, border: "1px dashed #ccc", borderRadius: 10 }}>
        <b>Audio</b>: {String(node.props.url ?? "")}
      </div>
    ),
  },
  file: {
    render: (node) => (
      <div style={{ padding: 12, border: "1px dashed #ccc", borderRadius: 10 }}>
        <b>File</b>: {String(node.props.label ?? "Download")} (
        {String(node.props.url ?? "")})
      </div>
    ),
  },

  more: {
    render: (node) => (
      <a href={node.props.href ?? "#"} style={{ textDecoration: "underline" }}>
        {node.props.text ?? "More"}
      </a>
    ),
  },

  search: {
    render: (node) => (
      <div style={{ padding: 12, border: "1px dashed #ccc", borderRadius: 10 }}>
        <b>Search</b> placeholder: {String(node.props.placeholder ?? "")}
      </div>
    ),
  },
  calendar: {
    render: (node) => (
      <div style={{ padding: 12, border: "1px dashed #ccc", borderRadius: 10 }}>
        <b>Calendar</b> provider: {String(node.props.provider ?? "")}, view:{" "}
        {String(node.props.view ?? "")}
      </div>
    ),
  },
  navigation: {
    render: () => (
      <div style={{ padding: 12, border: "1px dashed #ccc", borderRadius: 10 }}>
        <b>Navigation</b>
      </div>
    ),
  },
  menu: {
    render: (node) => (
      <div style={{ padding: 12, border: "1px dashed #ccc", borderRadius: 10 }}>
        <b>Menu</b> {String(node.props.title ?? "")}
      </div>
    ),
  },
  auth: {
    render: (node) => (
      <div style={{ padding: 12, border: "1px dashed #ccc", borderRadius: 10 }}>
        <b>Login/Logout</b> mode: {String(node.props.mode ?? "")}
      </div>
    ),
  },
  cart: {
    render: () => (
      <div style={{ padding: 12, border: "1px dashed #ccc", borderRadius: 10 }}>
        <b>Cart</b>
      </div>
    ),
  },
  pagination: {
    render: (node) => (
      <div style={{ padding: 12, border: "1px dashed #ccc", borderRadius: 10 }}>
        <b>Pagination</b> page {String(node.props.page ?? 1)}
      </div>
    ),
  },
  line: {
    render: (node) => (
      <hr
        style={{
          margin: "12px 0",
          borderTopWidth: Number(node.props.height ?? 1),
        }}
      />
    ),
  },
  section: {
    isContainer: true,
    render: (node, { renderChildren }) => (
      <section
        style={{
          padding: `${node.props?.paddingY ?? 40}px 0`,
          background: node.props?.bgColor ?? "#fff",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px" }}>
          {renderChildren(node)}
        </div>
      </section>
    ),
  },

  columns: {
    isContainer: true,
    render: (node, { renderChildren }) => (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${node.props?.cols ?? 2}, minmax(0, 1fr))`,
          gap: node.props?.gap ?? 16,
        }}
      >
        {renderChildren(node)}
      </div>
    ),
  },

  heading: {
    render: (node) => {
      const level = Math.min(6, Math.max(1, Number(node.props?.level ?? 2)));
      const Tag = `h${level}` as any;
      return (
        <Tag
          style={{ textAlign: node.props?.align ?? "left", margin: "8px 0" }}
        >
          {node.props?.text ?? "Heading"}
        </Tag>
      );
    },
  },

  text: {
    render: (node) => (
      <p style={{ margin: "8px 0" }}>{node.props?.text ?? "Text..."}</p>
    ),
  },

  button: {
    render: (node) => (
      <a
        href={node.props?.href ?? "#"}
        style={{
          display: "inline-block",
          padding: "10px 14px",
          border: "1px solid #111",
          borderRadius: 10,
          textDecoration: "none",
        }}
      >
        {node.props?.text ?? "Button"}
      </a>
    ),
  },

  image: {
    render: (node) => (
      <img
        src={node.props?.src ?? "https://placehold.co/1000x500"}
        alt={node.props?.alt ?? ""}
        style={{
          width: "100%",
          borderRadius: Number(node.props?.radius ?? 10),
        }}
      />
    ),
  },

  richText: {
    render: (node) => (
      <div style={{ padding: 12, border: "1px dashed #ccc", borderRadius: 10 }}>
        <b>RichText</b> contentId:{" "}
        <code>{String(node.props?.contentId ?? "null")}</code>
      </div>
    ),
  },
};

export function renderNode(node: LayoutNode): React.ReactNode {
  const def = registry[node.blockKey];

  const renderChildren = (n: LayoutNode) =>
    (n.children ?? []).map((c) => (
      <React.Fragment key={c.id}>{renderNode(c)}</React.Fragment>
    ));

  if (!def) {
    return (
      <div style={{ padding: 8, border: "1px solid #eee", borderRadius: 10 }}>
        Unknown block: <code>{node.blockKey}</code>
      </div>
    );
  }

  return def.render(node, { renderChildren });
}

export function isContainerBlock(blockKey: string) {
  return !!registry[blockKey]?.isContainer;
}
