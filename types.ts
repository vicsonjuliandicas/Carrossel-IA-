// FIX: Import React to solve 'Cannot find namespace 'React'' error.
import React from 'react';

export enum Tone {
  PROFESSIONAL = 'Profissional',
  FRIENDLY = 'Amigável',
  INSPIRATIONAL = 'Inspirador',
  HUMOROUS = 'Bem-humorado',
  EDUCATIONAL = 'Educacional',
  SARCASTIC = 'Sarcástico',
  EMPATHETIC = 'Empático',
  URGENT = 'Urgente',
  POETIC = 'Poético',
  MYSTERIOUS = 'Misterioso',
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
  titleFontFamily?: string;
  bodyFontFamily?: string;
  isTitleBold?: boolean;
  isTitleItalic?: boolean;
  isBodyBold?: boolean;
  isBodyItalic?: boolean;
  titleFontSize?: number;
  bodyFontSize?: number;
  textAlign?: 'left' | 'center' | 'right';
  isImageLoading?: boolean;
  authorName?: string;
  authorHandle?: string;
}

export interface VisualStyle {
  name: string;
  keywords: string;
  previewImageUrl: string;
  colorClass: string;
}

export type ViewMode = 'normal' | 'edit';