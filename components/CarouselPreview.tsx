
import React, { useState } from 'react';
import type { Slide, ColorPalette, ViewMode } from '../types';
import EditableSlide from './EditableSlide';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import ArrowRightIcon from './icons/ArrowRightIcon';
import SparklesIcon from './icons/SparklesIcon';

interface CarouselPreviewProps {
  slides: Slide[];
  palette: ColorPalette;
  isLoading: boolean;
  onUpdateSlide: (index: number, updatedFields: Partial<Slide>) => void;
  onRegenerateImage: (index: number) => void;
}

const CarouselPreview: React.FC<CarouselPreviewProps> = ({
  slides,
  palette,
  isLoading,
  onUpdateSlide,
  onRegenerateImage,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('edit'); // Novo estado para o modo de visualização

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-900/70 border border-gray-800 rounded-lg animate-pulse">
          <SparklesIcon className="w-16 h-16 text-cyan-400 mb-4 animate-bounce" />
          <h3 className="text-xl font-semibold text-white">
            Gerando sua obra-prima...
          </h3>
          <p className="text-gray-400 mt-2">
            A IA está criando suas imagens e textos. Isso pode levar um momento.
          </p>
        </div>
      );
    }

    if (slides.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-900/70 border border-gray-800 rounded-lg">
          <SparklesIcon className="w-16 h-16 text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold text-white">
            Seu Carrossel Aguarda
          </h3>
          <p className="text-gray-400 mt-2">
            Preencha os detalhes à esquerda e deixe a IA criar algo incrível para você.
          </p>
        </div>
      );
    }

    return (
      <div className="relative">
        <div className="overflow-hidden rounded-lg">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div className="w-full flex-shrink-0" key={index}>
                <EditableSlide
                  slide={slide}
                  palette={palette}
                  onUpdate={(updatedFields) => onUpdateSlide(index, updatedFields)}
                  onRegenerateImage={() => onRegenerateImage(index)}
                  isActive={index === currentIndex}
                  viewMode={viewMode} // Passa o modo de visualização
                />
              </div>
            ))}
          </div>
        </div>

        {slides.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 z-20"
              aria-label="Slide anterior"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 z-20"
              aria-label="Próximo slide"
            >
              <ArrowRightIcon className="w-6 h-6" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    currentIndex === index ? 'bg-cyan-400' : 'bg-white/50'
                  }`}
                  aria-label={`Ir para o slide ${index + 1}`}
                ></button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };
  
  return (
    <div className="aspect-square w-full max-w-xl mx-auto xl:max-w-none">
        {/* Botões de modo de visualização */}
        {slides.length > 0 && !isLoading && (
          <div className="flex justify-center mb-4 space-x-2">
            <button
              onClick={() => setViewMode('normal')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                viewMode === 'normal' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Visualizar
            </button>
            <button
              onClick={() => setViewMode('edit')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                viewMode === 'edit' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Editar
            </button>
          </div>
        )}
        {renderContent()}
    </div>
  );
};

export default CarouselPreview;