
import React from 'react';
import type { ColorPalette, VisualStyle } from '../types';
import { Tone } from '../types';
import { TONES, COLOR_PALETTES, VISUAL_STYLES } from '../constants';
import SparklesIcon from './icons/SparklesIcon';

interface ControlsProps {
  theme: string;
  setTheme: (theme: string) => void;
  tone: Tone;
  setTone: (tone: Tone) => void;
  selectedPalette: ColorPalette;
  setSelectedPalette: (palette: ColorPalette) => void;
  selectedStyle: VisualStyle;
  setSelectedStyle: (style: VisualStyle) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  theme,
  setTheme,
  tone,
  setTone,
  selectedPalette,
  setSelectedPalette,
  selectedStyle,
  setSelectedStyle,
  onGenerate,
  isLoading,
}) => {
  // Helper to convert text/border Tailwind classes to background classes for preview
  const getBgClass = (className: string) => {
    if (className.startsWith('text-')) {
      return className.replace('text-', 'bg-');
    }
    if (className.startsWith('border-')) {
      return className.replace('border-', 'bg-');
    }
    return className;
  };

  return (
    <div className="space-y-8">
      <div>
        <label htmlFor="theme" className="block text-sm font-medium text-gray-400 mb-2">
          1. Sobre o que é o seu carrossel?
        </label>
        <input
          type="text"
          id="theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="Ex: O futuro da energia renovável"
          className="w-full bg-black border-gray-700 text-gray-200 rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          2. Escolha um tom de voz
        </label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value as Tone)}
          className="w-full bg-black border-gray-700 text-gray-200 rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition appearance-none"
        >
          {TONES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          3. Selecione uma paleta de cores
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {COLOR_PALETTES.map((palette) => (
            <button
              key={palette.name}
              onClick={() => setSelectedPalette(palette)}
              className={`p-2 rounded-lg text-center transition-all duration-200 border-2 ${
                selectedPalette.name === palette.name
                  ? 'border-cyan-400 scale-105 shadow-lg'
                  : 'border-transparent hover:border-gray-700'
              }`}
            >
              <div className="flex justify-center mb-1 space-x-0.5">
                <span className={`w-4 h-4 rounded-sm border border-gray-900 ${getBgClass(palette.background)}`}></span>
                <span className={`w-4 h-4 rounded-sm border border-gray-900 ${getBgClass(palette.primary)}`}></span>
                <span className={`w-4 h-4 rounded-sm border border-gray-900 ${getBgClass(palette.text)}`}></span>
                <span className={`w-4 h-4 rounded-sm border border-gray-900 ${getBgClass(palette.accent)}`}></span>
              </div>
              <span className="text-xs font-medium text-gray-400">{palette.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          4. Escolha um estilo visual
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {VISUAL_STYLES.map((style) => (
            <button
              key={style.name}
              onClick={() => setSelectedStyle(style)}
              className={`relative h-28 p-1.5 rounded-lg text-center flex items-center justify-center transition-all duration-200 border-2 group ${ 
                selectedStyle.name === style.name
                  ? 'border-cyan-400 scale-105 shadow-lg'
                  : 'border-transparent hover:border-gray-700'
              }`}
            >
              <div
                className="w-full h-full rounded-md flex flex-col items-center justify-center text-white font-semibold text-sm px-1 relative overflow-hidden" 
                style={{
                  backgroundImage: `url(${style.previewImageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-black/40 z-10"></div> 
                <span className="relative z-20">{style.name}</span> 
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50 pointer-events-none">
                {style.keywords}
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={isLoading || !theme}
        className="w-full flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
      >
        <SparklesIcon className="w-5 h-5 mr-2" />
        {isLoading ? 'Gerando...' : 'Gerar Carrossel'}
      </button>
    </div>
  );
};

export default Controls;