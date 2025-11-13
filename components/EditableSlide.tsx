import React, { useState, useEffect } from 'react';
import type { Slide, ColorPalette, ViewMode } from '../types';
import RefreshIcon from './icons/RefreshIcon';
import SparklesIcon from './icons/SparklesIcon';
import TwitterIcon from './icons/TwitterIcon';
import FacebookIcon from './icons/FacebookIcon';
import LinkedInIcon from './icons/LinkedInIcon';
import DownloadIcon from './icons/DownloadIcon';
import PlusIcon from './icons/PlusIcon';
import MinusIcon from './icons/MinusIcon';
import AlignLeftIcon from './icons/AlignLeftIcon';
import AlignCenterIcon from './icons/AlignCenterIcon';
import AlignRightIcon from './icons/AlignRightIcon';
import { FONTS } from '../constants';
import { createSlideImage, downloadBlobAsFile } from '../utils/downloadUtils';

interface EditableSlideProps {
  slide: Slide;
  palette: ColorPalette;
  onUpdate: (updatedFields: Partial<Slide>) => void;
  onRegenerateImage: () => void;
  isActive: boolean;
  viewMode: ViewMode;
}

const EditableSlide: React.FC<EditableSlideProps> = ({
  slide,
  palette,
  onUpdate,
  onRegenerateImage,
  isActive,
  viewMode,
}) => {
  const [title, setTitle] = useState(slide.title);
  const [body, setBody] = useState(slide.body);
  const [fontFamily, setFontFamily] = useState(slide.fontFamily || 'Poppins');
  const [titleFontSize, setTitleFontSize] = useState(slide.titleFontSize || 3.5);
  const [bodyFontSize, setBodyFontSize] = useState(slide.bodyFontSize || 1.5);
  const [textAlign, setTextAlign] = useState(slide.textAlign || 'center');
  const [isSingleSlideDownloading, setIsSingleSlideDownloading] = useState(false);


  useEffect(() => {
    setTitle(slide.title);
  }, [slide.title]);

  useEffect(() => {
    setBody(slide.body);
  }, [slide.body]);

  useEffect(() => {
    setFontFamily(slide.fontFamily || 'Poppins');
  }, [slide.fontFamily]);
  
  useEffect(() => {
    setTitleFontSize(slide.titleFontSize || 3.5);
  }, [slide.titleFontSize]);

  useEffect(() => {
    setBodyFontSize(slide.bodyFontSize || 1.5);
  }, [slide.bodyFontSize]);

  useEffect(() => {
    setTextAlign(slide.textAlign || 'center');
  }, [slide.textAlign]);


  const handleTitleBlur = () => {
    if (title !== slide.title) {
      onUpdate({ title });
    }
  };

  const handleBodyBlur = () => {
    if (body !== slide.body) {
      onUpdate({ body });
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const handleFontChange = (newFont: string) => {
    setFontFamily(newFont);
    onUpdate({ fontFamily: newFont });
  };
  
  const handleFontSizeChange = (element: 'title' | 'body', direction: 'increase' | 'decrease') => {
    const step = 0.1;
    if (element === 'title') {
      const currentSize = titleFontSize;
      const newSize = direction === 'increase' ? currentSize + step : currentSize - step;
      if (newSize >= 1.5 && newSize <= 8) { // Min/max size limits
        setTitleFontSize(newSize);
        onUpdate({ titleFontSize: newSize });
      }
    } else {
      const currentSize = bodyFontSize;
      const newSize = direction === 'increase' ? currentSize + step : currentSize - step;
       if (newSize >= 0.8 && newSize <= 4) { // Min/max size limits
        setBodyFontSize(newSize);
        onUpdate({ bodyFontSize: newSize });
      }
    }
  };

  const handleTextAlignChange = (newAlign: 'left' | 'center' | 'right') => {
    setTextAlign(newAlign);
    onUpdate({ textAlign: newAlign });
  };

  const currentFontFamily = FONTS.find(f => f.name === fontFamily)?.family || "'Poppins', sans-serif";

  const shareText = `${slide.title} - ${slide.body}`;
  const currentUrl = window.location.href; 

  const openShareWindow = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    openShareWindow(twitterUrl);
  };

  const handleShareFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(shareText)}`;
    openShareWindow(facebookUrl);
  };

  const handleShareLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(slide.title)}&summary=${encodeURIComponent(slide.body)}`;
    openShareWindow(linkedInUrl);
  };

  const handleDownloadSingleSlide = async () => {
    if (isSingleSlideDownloading) return;

    setIsSingleSlideDownloading(true);
    try {
      const slideBlob = await createSlideImage(slide);
      downloadBlobAsFile(slideBlob, `${slide.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`);
    } catch (error) {
      console.error("Failed to download single slide:", error);
    } finally {
      setIsSingleSlideDownloading(false);
    }
  };

  const isEditable = isActive && viewMode === 'edit';

  return (
    <div
      className="aspect-square w-full rounded-lg shadow-2xl flex flex-col justify-center items-center p-6 md:p-8 relative overflow-hidden text-white"
    >
      <img
        src={slide.imageUrl}
        alt={slide.title}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ease-in-out 
                    ${slide.isImageLoading ? 'filter blur-md opacity-70' : ''}`}
      />
      <div className="absolute inset-0 bg-black/50 z-10"></div>
      
      {slide.isImageLoading && (
         <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <SparklesIcon className="w-12 h-12 text-cyan-400 mb-4 animate-bounce" />
            <p className="text-lg font-semibold text-white">Recriando imagem...</p>
         </div>
      )}

      <button 
        onClick={onRegenerateImage}
        className={`absolute top-4 right-4 z-30 bg-black/50 text-white p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400
                    ${slide.isImageLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/70 hover:scale-110 hover:shadow-lg'}`}
        aria-label="Recriar imagem"
        title="Recriar imagem"
        disabled={!isActive || slide.isImageLoading}
      >
        {slide.isImageLoading ? (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <RefreshIcon className="w-5 h-5"/>
        )}
      </button>

      {isActive && (
        <div className="absolute bottom-4 right-4 z-40 flex space-x-2">
          <button
            onClick={handleDownloadSingleSlide}
            className={`bg-black/50 text-white p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 
                        ${isSingleSlideDownloading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/70 hover:scale-110 hover:shadow-lg'}`}
            aria-label="Baixar Slide"
            title="Baixar Slide"
            disabled={!isActive || isSingleSlideDownloading}
          >
            {isSingleSlideDownloading ? (
               <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
            ) : (
              <DownloadIcon className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={handleShareTwitter}
            className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 hover:scale-110 hover:shadow-lg"
            aria-label="Compartilhar no Twitter"
            title="Compartilhar no Twitter"
            disabled={!isActive}
          >
            <TwitterIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleShareFacebook}
            className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 hover:scale-110 hover:shadow-lg"
            aria-label="Compartilhar no Facebook"
            title="Compartilhar no Facebook"
            disabled={!isActive}
          >
            <FacebookIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleShareLinkedIn}
            className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 hover:scale-110 hover:shadow-lg"
            aria-label="Compartilhar no LinkedIn"
            title="Compartilhar no LinkedIn"
            disabled={!isActive}
          >
            <LinkedInIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="relative z-40 w-[80%] max-w-xl text-center flex flex-col justify-center items-center">
        {isEditable && (
          <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-xl p-2 flex flex-col items-center space-y-2 z-50 w-max">
            {/* Font Family Selector */}
            <div className="bg-black/30 rounded-full p-1 flex items-center space-x-1">
              {FONTS.map(font => (
                <button
                  key={font.name}
                  onClick={() => handleFontChange(font.name)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${fontFamily === font.name ? 'bg-cyan-500 text-white' : 'bg-transparent text-gray-300 hover:bg-white/20'}`}
                  style={{ fontFamily: font.family }}
                >
                  {font.name}
                </button>
              ))}
            </div>
             {/* Font Size & Align Controls */}
            <div className="flex items-center space-x-4 text-xs text-white">
               {/* Alignment */}
              <div className="bg-black/30 rounded-full p-1 flex items-center space-x-1">
                <button onClick={() => handleTextAlignChange('left')} className={`p-1 rounded-full ${textAlign === 'left' ? 'bg-cyan-500' : 'hover:bg-white/20'}`}><AlignLeftIcon className="w-4 h-4" /></button>
                <button onClick={() => handleTextAlignChange('center')} className={`p-1 rounded-full ${textAlign === 'center' ? 'bg-cyan-500' : 'hover:bg-white/20'}`}><AlignCenterIcon className="w-4 h-4" /></button>
                <button onClick={() => handleTextAlignChange('right')} className={`p-1 rounded-full ${textAlign === 'right' ? 'bg-cyan-500' : 'hover:bg-white/20'}`}><AlignRightIcon className="w-4 h-4" /></button>
              </div>
               {/* Font Size */}
              <div className="flex items-center space-x-1.5">
                <span className="font-medium">Título</span>
                <button onClick={() => handleFontSizeChange('title', 'decrease')} className="p-1 rounded-full hover:bg-white/20 transition-colors"><MinusIcon className="w-4 h-4" /></button>
                <span className="w-8 text-center font-mono">{titleFontSize.toFixed(1)}</span>
                <button onClick={() => handleFontSizeChange('title', 'increase')} className="p-1 rounded-full hover:bg-white/20 transition-colors"><PlusIcon className="w-4 h-4" /></button>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="font-medium">Corpo</span>
                <button onClick={() => handleFontSizeChange('body', 'decrease')} className="p-1 rounded-full hover:bg-white/20 transition-colors"><MinusIcon className="w-4 h-4" /></button>
                <span className="w-8 text-center font-mono">{bodyFontSize.toFixed(1)}</span>
                <button onClick={() => handleFontSizeChange('body', 'increase')} className="p-1 rounded-full hover:bg-white/20 transition-colors"><PlusIcon className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        )}
        <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            aria-label="Título do slide"
            style={{ fontFamily: currentFontFamily, fontSize: `${titleFontSize}rem`, lineHeight: 1.2, textAlign: textAlign }}
            className="w-full bg-transparent font-bold drop-shadow-lg focus:outline-none focus:bg-black/20 rounded-md px-2 py-1 transition-colors"
            disabled={!isEditable}
        />
        <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onBlur={handleBodyBlur}
            aria-label="Corpo do slide"
            style={{ fontFamily: currentFontFamily, fontSize: `${bodyFontSize}rem`, lineHeight: 1.6, textAlign: textAlign }}
            className="w-full bg-transparent leading-relaxed drop-shadow-lg resize-none focus:outline-none focus:bg-black/20 rounded-md px-2 py-1 transition-colors mt-4"
            rows={3}
            disabled={!isEditable}
        />
      </div>
    </div>
  );
};

export default EditableSlide;