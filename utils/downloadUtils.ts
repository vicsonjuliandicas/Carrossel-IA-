import JSZip from 'jszip';
import type { Slide } from '../types';

const CANVAS_SIZE = 1080; // Padrão para posts do Instagram

const getWrappedLines = (
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines?: number
): string[] => {
  const words = text.split(' ');
  let line = '';
  let lines: string[] = [];

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  if (maxLines && lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    const lastLineIndex = lines.length - 1;
    // Check if there was more text that got cut
    if (text.split(' ').length > lines.join(' ').split(' ').length) {
        lines[lastLineIndex] = lines[lastLineIndex].trim().slice(0, -1) + '...';
    }
  }

  return lines.map(l => l.trim());
};

const drawTextWithOutline = (
    context: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number
) => {
    context.strokeText(text, x, y);
    context.fillText(text, x, y);
};


export const createSlideImage = async (slide: Slide): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Não foi possível obter o contexto do canvas.');
  }

  const selectedFont = slide.fontFamily || 'Poppins';
  const titleFontFamily = selectedFont === 'Anton' ? 'Anton' : selectedFont;
  const bodyFontFamily = 'Poppins'; // Keep Poppins for body for readability

  // Ensure fonts are loaded before using them on canvas
  await document.fonts.load(`bold ${CANVAS_SIZE * 0.09}px ${titleFontFamily}`);
  await document.fonts.load(`${CANVAS_SIZE * 0.04}px ${bodyFontFamily}`);

  // Carregar imagem de fundo
  const backgroundImage = new Image();
  backgroundImage.crossOrigin = 'Anonymous';
  
  const loadPromise = new Promise((resolve, reject) => {
    backgroundImage.onload = resolve;
    backgroundImage.onerror = reject;
    backgroundImage.src = slide.imageUrl;
  });

  await loadPromise;
  
  ctx.filter = 'blur(8px)';
  ctx.drawImage(backgroundImage, -20, -20, CANVAS_SIZE + 40, CANVAS_SIZE + 40);
  
  ctx.filter = 'none';

  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  const padding = CANVAS_SIZE * 0.1;
  const maxWidth = CANVAS_SIZE - padding * 2;
  const textAlign = slide.textAlign || 'center';
  ctx.textAlign = textAlign;

  let textX: number;
  if (textAlign === 'left') {
    textX = padding;
  } else if (textAlign === 'right') {
    textX = CANVAS_SIZE - padding;
  } else {
    textX = CANVAS_SIZE / 2;
  }


  // --- Text Height Calculation for Vertical Centering ---
  const titleLineHeight = CANVAS_SIZE * 0.1;
  const bodyLineHeight = CANVAS_SIZE * 0.055;
  const spacing = CANVAS_SIZE * 0.05; // Space between title and body

  // Measure Title
  ctx.font = `bold ${CANVAS_SIZE * 0.09}px ${titleFontFamily}`;
  const titleLines = getWrappedLines(ctx, slide.title, maxWidth, 2); // Allow title to wrap to 2 lines
  const titleHeight = titleLines.length * titleLineHeight;

  // Measure Body
  ctx.font = `${CANVAS_SIZE * 0.04}px ${bodyFontFamily}`;
  const bodyLines = getWrappedLines(ctx, slide.body, maxWidth, 3); // Allow body to wrap to 3 lines
  const bodyHeight = bodyLines.length * bodyLineHeight;

  const totalTextHeight = titleHeight + (bodyLines.length > 0 ? spacing + bodyHeight : 0);
  let currentY = (CANVAS_SIZE - totalTextHeight) / 2;

  // --- Text Drawing ---
  ctx.textBaseline = 'top'; // Align text from the top for precise positioning
  ctx.strokeStyle = '#000000'; // Black outline
  ctx.lineWidth = 10;
  ctx.lineJoin = 'round';
  ctx.fillStyle = '#FFFFFF'; // White text

  // Draw Title
  ctx.font = `bold ${CANVAS_SIZE * 0.09}px ${titleFontFamily}`;
  for (const line of titleLines) {
      drawTextWithOutline(ctx, line, textX, currentY);
      currentY += titleLineHeight;
  }
  
  if (bodyLines.length > 0) {
      currentY += spacing;
  }

  // Draw Body
  ctx.font = `${CANVAS_SIZE * 0.04}px ${bodyFontFamily}`;
  for (const line of bodyLines) {
      drawTextWithOutline(ctx, line, textX, currentY);
      currentY += bodyLineHeight;
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Falha ao criar blob da imagem do slide.'));
      }
    }, 'image/png');
  });
};

export const downloadBlobAsFile = (blob: Blob, filename: string) => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

export const downloadCarouselAsZip = async (slides: Slide[]): Promise<void> => {
  const zip = new JSZip();

  await Promise.all(
    slides.map(async (slide, index) => {
      const blob = await createSlideImage(slide);
      zip.file(`slide-${index + 1}.png`, blob);
    })
  );

  const zipBlob = await zip.generateAsync({ type: 'blob' });

  downloadBlobAsFile(zipBlob, 'carrossel-ia.zip');
};