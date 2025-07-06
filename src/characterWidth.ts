export function getCharacterWidth(char: string): number {
  const codePoint = char.codePointAt(0);
  if (!codePoint) {
    return 0;
  }

  // ASCII characters (width: 1)
  if (codePoint <= 0x7f) {
    return 1;
  }

  // Half-width katakana (width: 1)
  if (codePoint >= 0xff61 && codePoint <= 0xff9f) {
    return 1;
  }

  // Full-width ASCII (width: 2)
  if (codePoint >= 0xff01 && codePoint <= 0xff5e) {
    return 2;
  }

  // Hiragana (width: 2)
  if (codePoint >= 0x3040 && codePoint <= 0x309f) {
    return 2;
  }

  // Katakana (width: 2)
  if (codePoint >= 0x30a0 && codePoint <= 0x30ff) {
    return 2;
  }

  // CJK Unified Ideographs (Kanji) (width: 2)
  if (codePoint >= 0x4e00 && codePoint <= 0x9fff) {
    return 2;
  }

  // Emoji and other symbols (width: 2)
  // This is a simplified approach - in reality,
  // emoji width detection is more complex
  if (codePoint >= 0x1f000 && codePoint <= 0x1f9ff) {
    return 2;
  }

  // Other miscellaneous symbols and pictographs
  if (codePoint >= 0x2600 && codePoint <= 0x26ff) {
    return 2;
  }

  // Emoticons
  if (codePoint >= 0x1f600 && codePoint <= 0x1f64f) {
    return 2;
  }

  // Transport and map symbols
  if (codePoint >= 0x1f680 && codePoint <= 0x1f6ff) {
    return 2;
  }

  // Additional symbols
  if (codePoint >= 0x2700 && codePoint <= 0x27bf) {
    return 2;
  }

  // Default to width 1 for other characters
  return 1;
}

export function calculateVisualWidth(text: string, tabSize: number): number {
  let width = 0;
  let column = 0;

  for (const char of text) {
    if (char === "\t") {
      const tabStop = Math.ceil((column + 1) / tabSize) * tabSize;
      width += tabStop - column;
      column = tabStop;
    } else {
      const charWidth = getCharacterWidth(char);
      width += charWidth;
      column += charWidth;
    }
  }

  return width;
}

export function findExceedingPosition(
  text: string,
  maxLength: number,
  tabSize: number
): number | null {
  let width = 0;
  let column = 0;
  let position = 0;

  for (const char of text) {
    if (char === "\t") {
      const tabStop = Math.ceil((column + 1) / tabSize) * tabSize;
      width += tabStop - column;
      column = tabStop;
    } else {
      const charWidth = getCharacterWidth(char);
      width += charWidth;
      column += charWidth;
    }

    if (width > maxLength) {
      return position;
    }

    position++;
  }

  return null;
}
