"use client";
import { useMemo, useState } from "react";
import Editor from "react-simple-wysiwyg";

export default function TextEditor() {
  const [html, setHtml] = useState("my <b>HTML</b>");

  const cleanHtml = useMemo(() => {
    if (typeof window === "undefined") return html;
    const doc = new DOMParser().parseFromString(html, "text/html");

    doc.querySelectorAll("*").forEach((el) => {
      el.removeAttribute("style");
      el.removeAttribute("dir");
      el.removeAttribute("class");
      el.removeAttribute("role");
      el.removeAttribute("id");
      for (let i = 0; i < el.attributes.length; i++) {
        const attr = el.attributes[i];
        if (attr.name.startsWith("aria-")) {
          el.removeAttribute(attr.name);
          i--;
        }
      }
    });

    doc.querySelectorAll("li > p").forEach((el) => {
      if (!el.parentElement) return;
      if (el.parentElement.querySelectorAll("p").length > 1) return;
      el.parentElement.innerHTML = el.innerHTML;
    });

    doc.querySelectorAll("p").forEach((el) => {
      if (!el.innerHTML.trim()) el.remove();
      if (el.innerHTML.trim().match(/^<br\/?>$/)) el.remove();
    });

    return doc.body.innerHTML
      .replace(/<\/?span([.\r\n]*)>/gi, "")
      .replace(/<\/p><br\/?><p([\s>])/, "</p><p$1")
      .replace(/<br\/?>$/, "");
  }, [html]);

  return (
    <div className="p-20">
      <Editor
        className="h-[400px]"
        value={html}
        onChange={(e) => setHtml(e.target.value)}
      />
      <textarea
        className="w-full h-[400px] border p-2 mt-4"
        value={cleanHtml || ""}
        readOnly
      />
    </div>
  );
}
