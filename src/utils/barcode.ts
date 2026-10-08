/**
 * Lightweight SVG QR Code and Barcode Renderer
 * Produces crisp, scalable vector barcodes and QR code matrices for asset labeling
 */

// Simple deterministic hash to create repeatable QR module matrices
function pseudoHash(str: string, seed: number): number {
  let h = seed;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * Generates an SVG 2D QR Code Matrix
 */
export function generateQrMatrix(text: string, size = 25): boolean[][] {
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // 1. Draw standard finder patterns at 3 corners (7x7)
  const drawFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[startY + r][startX + c] = true;
        } else {
          matrix[startY + r][startX + c] = false;
        }
      }
    }
  };

  drawFinder(0, 0); // top-left
  drawFinder(size - 7, 0); // top-right
  drawFinder(0, size - 7); // bottom-left

  // 2. Draw timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // 3. Fill data modules deterministically based on text
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Skip finder zones
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= size - 8;
      const inBottomLeft = r >= size - 8 && c < 8;
      const inTiming = (r === 6 && c >= 8 && c < size - 8) || (c === 6 && r >= 8 && r < size - 8);

      if (!inTopLeft && !inTopRight && !inBottomLeft && !inTiming) {
        const h = pseudoHash(text + `:${r}:${c}`, (r * 33 + c * 7 + 101));
        matrix[r][c] = (h % 3) === 0 || ((r + c + h) % 2 === 0);
      }
    }
  }

  return matrix;
}

/**
 * Generates a clean 1D barcode pattern (Code 128 style stripes)
 */
export function generateBarcodeBars(code: string): number[] {
  const bars: number[] = [2, 1, 1, 2]; // Start pattern
  for (let i = 0; i < code.length; i++) {
    const charCode = code.charCodeAt(i);
    const b1 = (charCode % 3) + 1;
    const s1 = ((charCode >> 1) % 2) + 1;
    const b2 = ((charCode >> 2) % 3) + 1;
    const s2 = ((charCode >> 3) % 2) + 1;
    bars.push(b1, s1, b2, s2);
  }
  bars.push(2, 3, 1, 2); // Stop pattern
  return bars;
}
