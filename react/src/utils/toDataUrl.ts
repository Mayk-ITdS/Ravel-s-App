const toDataUrl = (b64: any) => {
  if (!b64) return undefined;
  if (b64.startsWith("data:")) return b64;

  const mime = b64.startsWith("UklGR")
    ? "image/webp"
    : b64.startsWith("/9j/")
      ? "image/jpeg"
      : b64.startsWith("iVBORw0KGgo")
        ? "image/png"
        : "application/octet-stream";

  return `data:${mime};base64,${b64}`;
};

export default toDataUrl;
