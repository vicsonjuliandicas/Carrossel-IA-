

import type { ColorPalette, VisualStyle } from './types';
import { Tone } from './types';

export const TONES: Tone[] = [
  Tone.PROFESSIONAL,
  Tone.FRIENDLY,
  Tone.INSPIRATIONAL,
  Tone.HUMOROUS,
  Tone.EDUCATIONAL,
];

export const FONTS = [
  { name: 'Poppins', family: "'Poppins', sans-serif" },
  { name: 'Anton', family: "'Anton', sans-serif" },
  { name: 'Montserrat', family: "'Montserrat', sans-serif" },
  { name: 'Oswald', family: "'Oswald', sans-serif" },
  { name: 'Roboto Slab', family: "'Roboto Slab', serif" },
  { name: 'Lobster', family: "'Lobster', cursive" },
];

export const COLOR_PALETTES: ColorPalette[] = [
  {
    name: 'Cyber Glow',
    keywords: 'neon, futuristic, dark, vibrant, synthwave',
    background: 'bg-gray-800',
    primary: 'bg-purple-600',
    text: 'text-white',
    accent: 'border-cyan-400',
  },
  {
    name: 'Nature Bliss',
    keywords: 'earthy, natural, calming, green, brown',
    background: 'bg-green-50',
    primary: 'bg-green-700',
    text: 'text-gray-800',
    accent: 'border-yellow-500',
  },
  {
    name: 'Oceanic',
    keywords: 'ocean, blue, deep sea, calm, water',
    background: 'bg-blue-50',
    primary: 'bg-blue-800',
    text: 'text-gray-900',
    accent: 'border-teal-400',
  },
  {
    name: 'Sunset',
    keywords: 'warm, sunset, orange, red, vibrant',
    background: 'bg-orange-50',
    primary: 'bg-red-600',
    text: 'text-gray-800',
    accent: 'border-yellow-400',
  },
  {
    name: 'Minimalist',
    keywords: 'minimalist, clean, modern, black and white',
    background: 'bg-white',
    primary: 'bg-gray-800',
    text: 'text-black',
    accent: 'border-gray-400',
  },
];

export const VISUAL_STYLES: VisualStyle[] = [
  {
    name: 'Fotografia',
    keywords: 'fotorealista, fotografia profissional, foco nítido, 8k',
    previewImageUrl: 'https://images.unsplash.com/photo-1506744038136-462a42ee6ee4?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    name: 'Ilustração',
    keywords: 'ilustração digital, arte vetorial, cores vibrantes, linhas limpas',
    previewImageUrl: 'https://images.unsplash.com/photo-1543286377-a892b1526469?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    name: 'Fantasia',
    keywords: 'arte de fantasia, épico, detalhado, iluminação cinematográfica, matte painting',
    previewImageUrl: 'https://images.unsplash.com/photo-1563299797-2851edc48970?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Changed to a more explicit fantasy image
  },
  {
    name: 'Vintage',
    keywords: 'foto vintage, retrô, estilo anos 70, grão de filme, cores suaves, tom sépia',
    previewImageUrl: 'https://images.unsplash.com/photo-1507984360341-2b0f4a8e2f8f?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Changed to a more explicit vintage image
  },
  {
    name: 'Minimalista',
    keywords: 'minimalista, fundo limpo, simples, elegante, iluminação de estúdio',
    previewImageUrl: 'https://images.unsplash.com/photo-1516541176645-f04505f03932?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
    {
    name: 'Cyberpunk',
    keywords: 'cyberpunk, luzes de neon, cidade futurista, distópico, alta tecnologia, vibrante',
    previewImageUrl: 'https://images.unsplash.com/photo-1549313861-33587f3d2956?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    name: 'Aquarela',
    keywords: 'pintura em aquarela, lavagem suave, cores vibrantes, artístico, pintado à mão',
    previewImageUrl: 'https://images.unsplash.com/photo-1563624239-505151523b50?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    name: '3D Render',
    keywords: 'renderização 3D, CGI, cinemático, renderização octane, hiper-realista, arte digital',
    previewImageUrl: 'https://images.unsplash.com/photo-1628373383639-9133215cde2e?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];