import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { isValidElement } from "react";
import Link from "next/link";
import type { MDXComponents } from "mdx/types";

/**
 * Global MDX element mapping (required by @next/mdx with the App Router).
 * Only Markdown syntax is mapped — raw JSX written inside .mdx is rendered as-is.
 * Articles never get an <h1> from MDX: the page renders H1 from the SEO registry,
 * so a stray `# Heading` is downgraded to <h2>.
 */

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

/** "Lỗi thường gặp" → "loi-thuong-gap" — stable anchors for the table of contents. */
function headingId(children: ReactNode): string {
  return textOf(children)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type HeadingProps = ComponentPropsWithoutRef<"h2">;

function H2({ children, id, ...props }: HeadingProps) {
  return (
    <h2
      id={id ?? headingId(children)}
      className="mt-12 scroll-mt-24 font-display text-2xl leading-tight font-extrabold tracking-[-0.02em] text-ink md:text-[1.75rem]"
      {...props}
    >
      {children}
    </h2>
  );
}

function H3({ children, id, ...props }: HeadingProps) {
  return (
    <h3
      id={id ?? headingId(children)}
      className="mt-8 scroll-mt-24 text-lg font-bold text-ink md:text-xl"
      {...props}
    >
      {children}
    </h3>
  );
}

const SAFE_HREF = /^(\/|#|https:|mailto:)/;

function A({ href = "", children, ...props }: ComponentPropsWithoutRef<"a">) {
  const className =
    "font-medium text-rose-700 underline decoration-rose-100 decoration-2 underline-offset-4 transition-colors hover:decoration-rose-500";
  // Anything else (javascript:, http:, relative paths…) renders as plain text.
  if (!SAFE_HREF.test(href)) return <span>{children}</span>;
  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link {...props} href={href} className={className}>
        {children}
      </Link>
    );
  }
  if (href.startsWith("mailto:")) {
    return (
      <a {...props} href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <a {...props} href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

const components = {
  h1: H2,
  h2: H2,
  h3: H3,
  p: (props) => <p className="mt-5 leading-[1.75]" {...props} />,
  ul: (props) => <ul className="mt-5 list-disc space-y-2 pl-6 marker:text-rose-500" {...props} />,
  ol: (props) => (
    <ol
      className="mt-5 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-rose-700"
      {...props}
    />
  ),
  li: (props) => <li className="pl-1 leading-[1.7]" {...props} />,
  a: A,
  strong: (props) => <strong className="font-semibold text-ink" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="mt-6 rounded-r-xl border-l-4 border-rose-500 bg-rose-50 px-5 py-4 text-ink [&>p:first-child]:mt-0"
      {...props}
    />
  ),
  hr: () => <hr className="my-12 border-border" />,
  // Tables only appear if GFM is enabled later; mapped now so styling is ready.
  table: (props) => (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm" {...props} />
    </div>
  ),
  th: (props) => (
    <th className="border-b-2 border-border px-3 py-2 font-semibold text-ink" {...props} />
  ),
  td: (props) => <td className="border-b border-border px-3 py-2 align-top" {...props} />,
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
