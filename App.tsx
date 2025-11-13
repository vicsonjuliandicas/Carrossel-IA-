import React, { useState, useEffect } from 'react';
import type { Slide, ColorPalette, VisualStyle } from './types';
import { Tone } from './types';
import { COLOR_PALETTES, VISUAL_STYLES } from './constants';
import Controls from './components/Controls';
import CarouselPreview from './components/CarouselPreview';
import DownloadButton from './components/DownloadButton';
import { generateCarouselContent, regenerateSlideImage } from './services/geminiService';

const App: React.FC = () => {
  const [theme, setTheme] = useState<string>(() => localStorage.getItem('carouselTheme') || '');
  const [tone, setTone] = useState<Tone>(() => (localStorage.getItem('carouselTone') as Tone) || Tone.INSPIRATIONAL);
  
  const getInitialPalette = (): ColorPalette => {
    try {
      const saved = localStorage.getItem('carouselPalette');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure the saved palette still exists in our constants
        return COLOR_PALETTES.find(p => p.name === parsed.name) || COLOR_PALETTES[0];
      }
    } catch (e) {
      console.error("Failed to parse palette from localStorage", e);
    }
    return COLOR_PALETTES[0];
  };
  const [selectedPalette, setSelectedPalette] = useState<ColorPalette>(getInitialPalette);

  const getInitialStyle = (): VisualStyle => {
    try {
      const saved = localStorage.getItem('carouselStyle');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure the saved style still exists in our constants
        return VISUAL_STYLES.find(s => s.name === parsed.name) || VISUAL_STYLES[0];
      }
    } catch (e) {
      console.error("Failed to parse style from localStorage", e);
    }
    return VISUAL_STYLES[0];
  };
  const [selectedStyle, setSelectedStyle] = useState<VisualStyle>(getInitialStyle);
  
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('carouselTheme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('carouselTone', tone);
  }, [tone]);

  useEffect(() => {
    localStorage.setItem('carouselPalette', JSON.stringify(selectedPalette));
  }, [selectedPalette]);

  useEffect(() => {
    localStorage.setItem('carouselStyle', JSON.stringify(selectedStyle));
  }, [selectedStyle]);

  const handleGenerate = async () => {
    if (!theme.trim()) {
      setError('Por favor, insira um tema para o seu carrossel.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setSlides([]);

    try {
      const generatedSlidesData = await generateCarouselContent(theme, tone, selectedPalette, selectedStyle);
      const slidesWithDefaults = generatedSlidesData.map(slide => ({
        ...slide,
        fontFamily: 'Poppins', // Add default font
        titleFontSize: 1.5, // Start with the smallest font size
        bodyFontSize: 0.8, // Start with the smallest font size
        textAlign: 'center', // Default alignment
      }));
      setSlides(slidesWithDefaults);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSlide = (index: number, updatedFields: Partial<Slide>) => {
    setSlides(currentSlides =>
      currentSlides.map((slide, i) =>
        i === index ? { ...slide, ...updatedFields } : slide
      )
    );
  };

  const handleRegenerateImage = async (index: number) => {
    let slideToRegenerate: Slide | null = null;
    
    setSlides(currentSlides => {
        slideToRegenerate = currentSlides[index];
        return currentSlides.map((slide, i) =>
            i === index ? { ...slide, isImageLoading: true } : slide
        );
    });
    setError(null);

    if (!slideToRegenerate) {
        setError("Não foi possível encontrar o slide para recriar.");
        return;
    }

    try {
      const newImageUrl = await regenerateSlideImage(
        { title: slideToRegenerate.title, body: slideToRegenerate.body },
        selectedPalette,
        selectedStyle
      );
      
      setSlides(currentSlides =>
        currentSlides.map((slide, i) =>
          i === index
            ? { ...slide, imageUrl: newImageUrl, isImageLoading: false }
            : slide
        )
      );
    } catch (err: any) {
      setError(err.message || 'Falha ao recriar a imagem.');
      setSlides(currentSlides =>
        currentSlides.map((slide, i) =>
          i === index ? { ...slide, isImageLoading: false } : slide
        )
      );
    }
  };


  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Criador de <span className="text-cyan-400">Carrossel</span> com IA
          </h1>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Transforme suas ideias em carrosséis impressionantes para redes sociais em segundos. Apenas forneça um tema, escolha um estilo e deixe a IA fazer o resto.
          </p>
        </header>

        {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative mb-8" role="alert">
                <strong className="font-bold">Oops! </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-16 items-start">
          <div className="bg-gray-900/70 p-6 md:p-8 rounded-2xl border border-gray-800">
            <Controls
              theme={theme}
              setTheme={setTheme}
              tone={tone}
              setTone={setTone}
              selectedPalette={selectedPalette}
              setSelectedPalette={setSelectedPalette}
              selectedStyle={selectedStyle}
              setSelectedStyle={setSelectedStyle}
              onGenerate={handleGenerate}
              isLoading={isLoading || isDownloading}
            />
          </div>
          
          <div className="w-full">
            <CarouselPreview
              slides={slides}
              palette={selectedPalette}
              isLoading={isLoading}
              onUpdateSlide={handleUpdateSlide}
              onRegenerateImage={handleRegenerateImage}
            />
            {slides.length > 0 && !isLoading && (
              <div className="mt-6">
                <DownloadButton 
                  slides={slides}
                  isDownloading={isDownloading}
                  onDownloadStart={() => {
                    setError(null);
                    setIsDownloading(true);
                  }}
                  onDownloadEnd={() => setIsDownloading(false)}
                  onDownloadError={(message) => setError(message)}
                />
              </div>
            )}
          </div>
        </div>

        <footer className="text-center mt-16 text-gray-500 text-sm">
            <p>Desenvolvido com Gemini. Projetado para a criatividade.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;