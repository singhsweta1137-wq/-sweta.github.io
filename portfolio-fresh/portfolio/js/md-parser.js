// js/md-parser.js — Lightweight Markdown → HTML parser

const MDParser = (() => {
  function parse(md) {
    if (!md) return "";
    let html = md;

    // Normalize line endings
    html = html.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    // Fenced code blocks (``` lang\n...\n```)
    html = html.replace(/```(\w*)\n([\s\S]*?)```/gm, (_, lang, code) => {
      const escaped = escapeHtml(code.trimEnd());
      const cls = lang ? ` class="language-${lang}"` : "";
      return `<pre><code${cls}>${escaped}</code></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, (_, c) => `<code>${escapeHtml(c)}</code>`);

    // Blockquotes
    html = html.replace(/^&gt; ?(.+)$/gm, "<blockquote>$1</blockquote>");
    // Also handle unescaped >
    html = html.replace(/^> ?(.+)$/gm, "<blockquote>$1</blockquote>");

    // Tables
    html = parseTable(html);

    // Headings
    html = html.replace(/^###### (.+)$/gm, "<h6>$1</h6>");
    html = html.replace(/^##### (.+)$/gm, "<h5>$1</h5>");
    html = html.replace(/^#### (.+)$/gm, "<h4>$1</h4>");
    html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
    html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
    html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

    // Horizontal rules
    html = html.replace(/^[-*_]{3,}$/gm, "<hr>");

    // Unordered lists
    html = parseList(html, /^[-*+] (.+)$/gm, "ul");

    // Ordered lists
    html = parseOrderedList(html);

    // Bold & italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
    html = html.replace(/___(.+?)___/g, "<strong><em>$1</em></strong>");
    html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");
    html = html.replace(/_([^_]+)_/g, "<em>$1</em>");

    // Strikethrough
    html = html.replace(/~~(.+?)~~/g, "<del>$1</del>");

    // Links with title
    html = html.replace(/\[(.+?)\]\((.+?)\s+"(.+?)"\)/g, '<a href="$2" title="$3" target="_blank" rel="noopener">$1</a>');
    // Links plain
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    // Images
    html = html.replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" loading="lazy">');

    // Paragraphs — wrap lines not already wrapped
    html = wrapParagraphs(html);

    return html;
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function parseTable(html) {
    // Match: header row | separator | data rows
    return html.replace(
      /((?:(?:[^\n]+\|[^\n]+)\n)+(?:\|?[-| :]+\|[-| :]+\|?)\n(?:(?:[^\n]+\|[^\n]+)\n?)+)/gm,
      (block) => {
        const lines = block.trim().split("\n");
        if (lines.length < 2) return block;
        const sepIdx = lines.findIndex((l) => /^[\|?\s?-\s?:]+$/.test(l.replace(/\|/g, "").trim()));
        if (sepIdx === -1) return block;

        const headerCells = splitRow(lines[0]);
        const dataLines = lines.slice(sepIdx + 1);

        const thead = `<thead><tr>${headerCells.map((c) => `<th>${c.trim()}</th>`).join("")}</tr></thead>`;
        const tbody = dataLines
          .map((l) => {
            const cells = splitRow(l);
            return `<tr>${cells.map((c) => `<td>${c.trim()}</td>`).join("")}</tr>`;
          })
          .join("");

        return `<div class="table-wrap"><table>${thead}<tbody>${tbody}</tbody></table></div>`;
      }
    );
  }

  function splitRow(row) {
    return row
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|");
  }

  function parseList(html, regex, tag) {
    // Group consecutive list items
    const lines = html.split("\n");
    const result = [];
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(/^[-*+] (.+)$/);
      if (m) {
        if (!inList) { result.push(`<${tag}>`); inList = true; }
        result.push(`<li>${m[1]}</li>`);
      } else {
        if (inList) { result.push(`</${tag}>`); inList = false; }
        result.push(lines[i]);
      }
    }
    if (inList) result.push(`</${tag}>`);
    return result.join("\n");
  }

  function parseOrderedList(html) {
    const lines = html.split("\n");
    const result = [];
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(/^\d+\. (.+)$/);
      if (m) {
        if (!inList) { result.push("<ol>"); inList = true; }
        result.push(`<li>${m[1]}</li>`);
      } else {
        if (inList) { result.push("</ol>"); inList = false; }
        result.push(lines[i]);
      }
    }
    if (inList) result.push("</ol>");
    return result.join("\n");
  }

  function wrapParagraphs(html) {
    const blockTags = /^<(h[1-6]|ul|ol|li|blockquote|pre|hr|table|thead|tbody|tr|th|td|div)/;
    return html
      .split(/\n{2,}/)
      .map((block) => {
        const trimmed = block.trim();
        if (!trimmed) return "";
        if (blockTags.test(trimmed)) return trimmed;
        // Single-line block tags
        if (/^<\/?[a-zA-Z]/.test(trimmed) && trimmed.endsWith(">")) return trimmed;
        return `<p>${trimmed.replace(/\n/g, " ")}</p>`;
      })
      .join("\n");
  }

  // Extract frontmatter (YAML-like key: value lines between --- markers)
  function parseFrontmatter(raw) {
    const match = raw.match(/^---\n([\s\S]+?)\n---\n?([\s\S]*)$/);
    if (!match) return { meta: {}, content: raw };

    const meta = {};
    match[1].split("\n").forEach((line) => {
      const colon = line.indexOf(":");
      if (colon === -1) return;
      const key = line.slice(0, colon).trim();
      let val = line.slice(colon + 1).trim();
      // Strip surrounding quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      // Parse arrays: [a, b, c]
      if (val.startsWith("[") && val.endsWith("]")) {
        val = val.slice(1, -1).split(",").map((v) => v.trim().replace(/^['"]|['"]$/g, ""));
      }
      meta[key] = val;
    });

    return { meta, content: match[2] };
  }

  return { parse, parseFrontmatter, escapeHtml };
})();

window.MDParser = MDParser;
