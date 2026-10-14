export type TileRect = { left: number; top: number; width: number; height: number };
export function fitGrid(count: number, width: number, height: number, gap = 12): TileRect[] {
  if (!count || width <= 0 || height <= 0) return [];
  const ratio = 1.6;
  let best = { columns: 1, width: 0, height: 0, score: -1 };
  for (let columns = 1; columns <= count; columns++) {
    const rows = Math.ceil(count / columns);
    const availableWidth = Math.max(1, (width - gap * (columns - 1)) / columns);
    const availableHeight = Math.max(1, (height - gap * (rows - 1)) / rows);
    const tileWidth = Math.min(availableWidth, availableHeight * ratio);
    const tileHeight = tileWidth / ratio;
    const score = tileWidth * tileHeight;
    if (score > best.score) best = { columns, width: tileWidth, height: tileHeight, score };
  }
  const rows = Math.ceil(count / best.columns);
  const totalHeight = rows * best.height + (rows - 1) * gap;
  return Array.from({ length: count }, (_, index) => {
    const row = Math.floor(index / best.columns);
    const column = index % best.columns;
    const inRow = Math.min(best.columns, count - row * best.columns);
    return {
      left: (width - (inRow * best.width + (inRow - 1) * gap)) / 2 + column * (best.width + gap),
      top: (height - totalHeight) / 2 + row * (best.height + gap),
      width: best.width,
      height: best.height,
    };
  });
}
export function spotlightLayout(width: number, height: number, thumbnails: number, gap = 12) {
  const mobile = width < 560;
  if (!thumbnails) return { main: { left: 0, top: 0, width, height }, thumbnails: [] };
  if (mobile) {
    const stripHeight = Math.min(height * 0.33, Math.max(110, width * 0.3));
    const mainHeight = Math.max(1, height - stripHeight - gap);
    return {
      main: { left: 0, top: 0, width, height: mainHeight },
      thumbnails: fitGrid(thumbnails, width, stripHeight, gap).map((r) => ({
        ...r,
        top: r.top + mainHeight + gap,
      })),
    };
  }
  const stripWidth = Math.min(360, Math.max(170, width * 0.27));
  const mainWidth = Math.max(1, width - stripWidth - gap);
  return {
    main: { left: 0, top: 0, width: mainWidth, height },
    thumbnails: fitGrid(thumbnails, stripWidth, height, gap).map((r) => ({
      ...r,
      left: r.left + mainWidth + gap,
    })),
  };
}
