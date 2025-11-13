// FIX: Import React to solve 'Cannot find namespace 'React'' error.
import React from 'react';

export enum Tone {
  PROFESSIONAL = 'Profissional',
  FRIENDLY = 'Amigável',
  INSPIRATIONAL = 'Inspirador',
  HUMOROUS = 'Bem-humorado',
  EDUCATIONAL = 'Educacional',
}

export interface ColorPalette {
  name: string;
  keywords: string;
  background: string;
  primary: string;
  text: string;
  accent: string;
}

export interface Slide {
  title: string;
  body: string;
  imageUrl: string;
  fontFamily?: string;
  titleFontSize?: number;
  bodyFontSize?: number;
  textAlign?: 'left' | 'center' | 'right';
  isImageLoading?: boolean;
}

export interface VisualStyle {
  name: string;
  keywords: string;
  previewImageUrl: string;
}

export type ViewMode = 'normal' | 'edit';