function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function truncateText(value, maxLength = 180) {
  const text = cleanText(value).replace(/\s+/g, " ");
  if (!text) {
    return "";
  }
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}...` : text;
}

function normalizeFileName(fileName) {
  const name = cleanText(fileName);
  return name || "未命名 PDF";
}

function mergeTextItemsToLines(items) {
  const lines = [];
  let lastY = null;
  let currentLine = [];

  items.forEach((item) => {
    const text = cleanText(item?.str);
    if (!text) {
      return;
    }
    const y = Math.round(item?.transform?.[5] ?? 0);
    if (lastY !== null && Math.abs(y - lastY) > 3 && currentLine.length) {
      lines.push(currentLine.join(" ").replace(/\s+/g, " ").trim());
      currentLine = [];
    }
    currentLine.push(text);
    lastY = y;
  });

  if (currentLine.length) {
    lines.push(currentLine.join(" ").replace(/\s+/g, " ").trim());
  }
  return lines.filter(Boolean);
}

function buildDocumentChunks(pages, maxChunkChars = 2200) {
  const chunks = [];
  let current = null;

  pages.forEach((page) => {
    const text = cleanText(page.text);
    if (!text) {
      return;
    }
    if (!current) {
      current = {
        pageStart: page.pageNumber,
        pageEnd: page.pageNumber,
        textParts: [text]
      };
      return;
    }
    const nextLength = current.textParts.join("\n\n").length + text.length + 2;
    if (nextLength > maxChunkChars) {
      const finalText = current.textParts.join("\n\n").trim();
      chunks.push({
        label: current.pageStart === current.pageEnd
          ? `第 ${current.pageStart} 页`
          : `第 ${current.pageStart}-${current.pageEnd} 页`,
        pageStart: current.pageStart,
        pageEnd: current.pageEnd,
        preview: truncateText(finalText, 220),
        text: finalText
      });
      current = {
        pageStart: page.pageNumber,
        pageEnd: page.pageNumber,
        textParts: [text]
      };
      return;
    }
    current.pageEnd = page.pageNumber;
    current.textParts.push(text);
  });

  if (current) {
    const finalText = current.textParts.join("\n\n").trim();
    chunks.push({
      label: current.pageStart === current.pageEnd
        ? `第 ${current.pageStart} 页`
        : `第 ${current.pageStart}-${current.pageEnd} 页`,
      pageStart: current.pageStart,
      pageEnd: current.pageEnd,
      preview: truncateText(finalText, 220),
      text: finalText
    });
  }

  return chunks;
}

function buildMaterialFromPdfDocument(document, maxChars = 18_000) {
  const lines = [`PDF 文件：${document.name}`];
  let totalChars = lines[0].length;

  (document.chunks || []).forEach((chunk) => {
    if (totalChars >= maxChars) {
      return;
    }
    const block = `[${chunk.label}]\n${chunk.text}`;
    if (totalChars + block.length + 2 > maxChars) {
      const remaining = maxChars - totalChars - 2;
      if (remaining > 120) {
        lines.push(`${block.slice(0, remaining - 3)}...`);
      }
      totalChars = maxChars;
      return;
    }
    lines.push(block);
    totalChars += block.length + 2;
  });

  return lines.join("\n\n").trim();
}

async function parsePdfBytes({ fileName, bytes }) {
  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const sourceBytes = Array.isArray(bytes) ? Uint8Array.from(bytes) : new Uint8Array(bytes || []);
  if (!sourceBytes.length) {
    throw new Error("PDF 内容为空，无法解析。");
  }

  const loadingTask = getDocument({
    data: sourceBytes,
    disableWorker: true,
    useSystemFonts: true,
    isEvalSupported: false
  });

  try {
    const pdfDocument = await loadingTask.promise;
    const pages = [];

    for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
      const page = await pdfDocument.getPage(pageNumber);
      const textContent = await page.getTextContent({
        disableCombineTextItems: false,
        normalizeWhitespace: true
      });
      const text = mergeTextItemsToLines(textContent.items).join("\n").trim();
      pages.push({
        pageNumber,
        charCount: text.length,
        preview: truncateText(text, 180),
        text
      });
    }

    const chunks = buildDocumentChunks(pages);
    const characterCount = pages.reduce((sum, page) => sum + page.charCount, 0);
    return {
      kind: "pdf",
      name: normalizeFileName(fileName),
      pageCount: pdfDocument.numPages,
      characterCount,
      importedAt: new Date().toISOString(),
      pages: pages.map((page) => ({
        pageNumber: page.pageNumber,
        charCount: page.charCount,
        preview: page.preview
      })),
      chunks,
      material: buildMaterialFromPdfDocument({
        name: normalizeFileName(fileName),
        chunks
      })
    };
  } catch (error) {
    throw new Error(error?.message || "PDF 解析失败，请换一个文件再试。");
  } finally {
    await loadingTask.destroy?.();
  }
}

module.exports = {
  buildMaterialFromPdfDocument,
  parsePdfBytes
};
