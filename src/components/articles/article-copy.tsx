"use client";

import { useRef, useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Copy editorial templates without sending their contents to a server. */
export function ArticleCopy({ title, text }: { title: string; text: string }) {
  const paragraph = useRef<HTMLParagraphElement>(null);
  const [status, setStatus] = useState("");
  const content = text.replace(/\\n/g, "\n");

  async function copy() {
    setStatus("");
    try {
      await navigator.clipboard.writeText(content);
      setStatus("Đã sao chép. Nhớ thay các phần trong ngoặc vuông trước khi dùng.");
    } catch {
      const selection = window.getSelection();
      if (paragraph.current && selection) {
        const range = document.createRange();
        range.selectNodeContents(paragraph.current);
        selection.removeAllRanges();
        selection.addRange(range);
        setStatus("Nội dung đã được chọn. Bạn bấm giữ hoặc dùng lệnh sao chép của thiết bị.");
      } else {
        setStatus("Không sao chép tự động được. Bạn chọn và sao chép phần nội dung bên trên nhé.");
      }
    }
  }

  return (
    <section className="my-6 rounded-2xl border border-border bg-surface p-5">
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p ref={paragraph} className="mt-3 leading-relaxed whitespace-pre-wrap text-ink">
        {content}
      </p>
      <Button
        type="button"
        variant="secondary"
        className="mt-4"
        onClick={copy}
        aria-label={`Sao chép: ${title}`}
      >
        <Copy aria-hidden /> Sao chép
      </Button>
      <p role="status" className="mt-2 text-sm text-muted">
        {status}
      </p>
    </section>
  );
}
