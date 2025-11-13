
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
  const [titleFontSize, setTitleFontSize] = useState(slide.titleFontSize || 3.5);
  const [bodyFontSize, setBodyFontSize] = useState(slide.bodyFontSize || 1.5);
  const [textAlign, setTextAlign] = useState(slide.textAlign || 'center');
  const [isSingleSlideDownloading, setIsSingleSlideDownloading] = useState(false);

  // New granular font states
  const [titleFontFamily, setTitleFontFamily] = useState(slide.titleFontFamily || 'Anton');
  const [isTitleBold, setIsTitleBold] = useState(slide.isTitleBold ?? true);
  const [isTitleItalic, setIsTitleItalic] = useState(slide.isTitleItalic || false);

  const [bodyFontFamily, setBodyFontFamily] = useState(slide.bodyFontFamily || 'Poppins');
  const [isBodyBold, setIsBodyBold] = useState(slide.isBodyBold || false);
  const [isBodyItalic, setIsBodyItalic] = useState(slide.isBodyItalic || false);

  // Sync state with props
  useEffect(() => { setTitle(slide.title); }, [slide.title]);
  useEffect(() => { setBody(slide.body); }, [slide.body]);
  useEffect(() => { setTitleFontSize(slide.titleFontSize || 3.5); }, [slide.titleFontSize]);
  useEffect(() => { setBodyFontSize(slide.bodyFontSize || 1.5); }, [slide.bodyFontSize]);
  useEffect(() => { setTextAlign(slide.textAlign || 'center'); }, [slide.textAlign]);

  useEffect(() => { setTitleFontFamily(slide.titleFontFamily || 'Anton'); }, [slide.titleFontFamily]);
  useEffect(() => { setIsTitleBold(slide.isTitleBold ?? true); }, [slide.isTitleBold]);
  useEffect(() => { setIsTitleItalic(slide.isTitleItalic || false); }, [slide.isTitleItalic]);
  
  useEffect(() => { setBodyFontFamily(slide.bodyFontFamily || 'Poppins'); }, [slide.bodyFontFamily]);
  useEffect(() => { setIsBodyBold(slide.isBodyBold || false); }, [slide.isBodyBold]);
  useEffect(() => { setIsBodyItalic(slide.isBodyItalic || false); }, [slide.isBodyItalic]);


  const handleTitleBlur = () => onUpdate({ title });
  const handleBodyBlur = () => onUpdate({ body });

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') e.currentTarget.blur();
  };
  
  const handleFontSizeChange = (element: 'title' | 'body', direction: 'increase' | 'decrease') => {
    const step = 0.1;
    if (element === 'title') {
      const newSize = direction === 'increase' ? titleFontSize + step : titleFontSize - step;
      if (newSize >= 1.5 && newSize <= 8) {
        setTitleFontSize(newSize);
        onUpdate({ titleFontSize: newSize });
      }
    } else {
      const newSize = direction === 'increase' ? bodyFontSize + step : bodyFontSize - step;
       if (newSize >= 0.8 && newSize <= 4) {
        setBodyFontSize(newSize);
        onUpdate({ bodyFontSize: newSize });
      }
    }
  };

  const handleTextAlignChange = (newAlign: 'left' | 'center' | 'right') => {
    setTextAlign(newAlign);
    onUpdate({ textAlign: newAlign });
  };
  
  const handleFontFamilyChange = (element: 'title' | 'body', value: string) => {
    if (element === 'title') {
        setTitleFontFamily(value);
        onUpdate({ titleFontFamily: value });
    } else {
        setBodyFontFamily(value);
        onUpdate({ bodyFontFamily: value });
    }
  };

  const handleStyleToggle = (
    field: 'isTitleBold' | 'isTitleItalic' | 'isBodyBold' | 'isBodyItalic'
  ) => {
    // A map of setters and current values to avoid a large switch statement
    const styleMap = {
        isTitleBold: { setter: setIsTitleBold, value: isTitleBold },
        isTitleItalic: { setter: setIsTitleItalic, value: isTitleItalic },
        isBodyBold: { setter: setIsBodyBold, value: isBodyBold },
        isBodyItalic: { setter: setIsBodyItalic, value: isBodyItalic },
    };
    const current = styleMap[field];
    const newValue = !current.value;
    current.setter(newValue);
    onUpdate({ [field]: newValue });
  };


  const getFontFamilyString = (fontName: string) => FONTS.find(f => f.name === fontName)?.family || "'Poppins', sans-serif";
  const currentTitleFontFamily = getFontFamilyString(titleFontFamily);
  const currentBodyFontFamily = getFontFamilyString(bodyFontFamily);

  const shareText = `${slide.title} - ${slide.body}`;
  const currentUrl = window.location.href; 

  const openShareWindow = (url: string) => window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
  const handleShareTwitter = () => openShareWindow(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`);
  const handleShareFacebook = () => openShareWindow(`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(shareText)}`);
  const handleShareLinkedIn = () => openShareWindow(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(slide.title)}&summary=${encodeURIComponent(slide.body)}`);

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
    <div className="aspect-square w-full rounded-lg shadow-2xl flex flex-col justify-start items-center p-10 md:p-12 relative overflow-hidden text-white">
      <img
        src={slide.imageUrl}
        alt={slide.title}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ease-in-out ${slide.isImageLoading ? 'filter blur-md opacity-70' : ''}`}
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
        className={`absolute top-4 right-4 z-30 bg-black/50 text-white p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${slide.isImageLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/70 hover:scale-110 hover:shadow-lg'}`}
        aria-label="Recriar imagem" title="Recriar imagem" disabled={!isActive || slide.isImageLoading}
      >
        {slide.isImageLoading ? (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        ) : (
          <RefreshIcon className="w-5 h-5"/>
        )}
      </button>

      {(slide.authorName || slide.authorHandle) && (
        <div className="absolute bottom-4 left-4 z-20 text-left text-white drop-shadow-md">
            {slide.authorName && <p className="text-base font-semibold">{slide.authorName}</p>}
            {slide.authorHandle && <p className="text-sm opacity-80">{slide.authorHandle}</p>}
        </div>
      )}

      {isActive && (
        <div className="absolute bottom-4 right-4 z-40 flex space-x-2">
          <button onClick={handleDownloadSingleSlide} className={`bg-black/50 text-white p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${isSingleSlideDownloading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/70 hover:scale-110 hover:shadow-lg'}`} aria-label="Baixar Slide" title="Baixar Slide" disabled={!isActive || isSingleSlideDownloading}>
            {isSingleSlideDownloading ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : <DownloadIcon className="w-5 h-5" />}
          </button>
          <button onClick={handleShareTwitter} className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 hover:scale-110 hover:shadow-lg" aria-label="Compartilhar no Twitter" title="Compartilhar no Twitter" disabled={!isActive}><TwitterIcon className="w-5 h-5" /></button>
          <button onClick={handleShareFacebook} className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 hover:scale-110 hover:shadow-lg" aria-label="Compartilhar no Facebook" title="Compartilhar no Facebook" disabled={!isActive}><FacebookIcon className="w-5 h-5" /></button>
          <button onClick={handleShareLinkedIn} className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 hover:scale-110 hover:shadow-lg" aria-label="Compartilhar no LinkedIn" title="Compartilhar no LinkedIn" disabled={!isActive}><LinkedInIcon className="w-5 h-5" /></button>
        </div>
      )}

      <div className="relative z-40 w-[80%] max-w-xl text-center flex flex-col justify-center items-center">
        {isEditable && (
          <div className="absolute -bottom-28 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-xl p-2.5 flex flex-col items-center space-y-2.5 z-50 w-max text-xs text-white">
            {/* Title Controls */}
            <div className="flex items-center space-x-2 w-full">
              <span className="font-medium w-12 text-left">Título</span>
              <select value={titleFontFamily} onChange={(e) => handleFontFamilyChange('title', e.target.value)} className="bg-black/30 rounded-full px-2 py-1 text-xs appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500">
                {FONTS.map(font => <option key={font.name} value={font.name}>{font.name}</option>)}
              </select>
              <button onClick={() => handleStyleToggle('isTitleBold')} className={`w-6 h-6 rounded-full font-bold transition-colors ${isTitleBold ? 'bg-cyan-500 text-white' : 'bg-black/30 hover:bg-white/20'}`}>B</button>
              <button onClick={() => handleStyleToggle('isTitleItalic')} className={`w-6 h-6 rounded-full italic transition-colors ${isTitleItalic ? 'bg-cyan-500 text-white' : 'bg-black/30 hover:bg-white/20'}`}>I</button>
              <div className="flex items-center space-x-1"><button onClick={() => handleFontSizeChange('title', 'decrease')} className="p-1 rounded-full hover:bg-white/20"><MinusIcon className="w-4 h-4" /></button><span className="w-8 text-center font-mono">{titleFontSize.toFixed(1)}</span><button onClick={() => handleFontSizeChange('title', 'increase')} className="p-1 rounded-full hover:bg-white/20"><PlusIcon className="w-4 h-4" /></button></div>
            </div>
             {/* Body Controls */}
            <div className="flex items-center space-x-2 w-full">
              <span className="font-medium w-12 text-left">Corpo</span>
              <select value={bodyFontFamily} onChange={(e) => handleFontFamilyChange('body', e.target.value)} className="bg-black/30 rounded-full px-2 py-1 text-xs appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500">
                {FONTS.map(font => <option key={font.name} value={font.name}>{font.name}</option>)}
              </select>
              <button onClick={() => handleStyleToggle('isBodyBold')} className={`w-6 h-6 rounded-full font-bold transition-colors ${isBodyBold ? 'bg-cyan-500 text-white' : 'bg-black/30 hover:bg-white/20'}`}>B</button>
              <button onClick={() => handleStyleToggle('isBodyItalic')} className={`w-6 h-6 rounded-full italic transition-colors ${isBodyItalic ? 'bg-cyan-500 text-white' : 'bg-black/30 hover:bg-white/20'}`}>I</button>
              <div className="flex items-center space-x-1"><button onClick={() => handleFontSizeChange('body', 'decrease')} className="p-1 rounded-full hover:bg-white/20"><MinusIcon className="w-4 h-4" /></button><span className="w-8 text-center font-mono">{bodyFontSize.toFixed(1)}</span><button onClick={() => handleFontSizeChange('body', 'increase')} className="p-1 rounded-full hover:bg-white/20"><PlusIcon className="w-4 h-4" /></button></div>
            </div>
             {/* Alignment Controls */}
            <div className="bg-black/30 rounded-full p-1 flex items-center space-x-1">
              <button onClick={() => handleTextAlignChange('left')} className={`p-1 rounded-full ${textAlign === 'left' ? 'bg-cyan-500' : 'hover:bg-white/20'}`}><AlignLeftIcon className="w-4 h-4" /></button>
              <button onClick={() => handleTextAlignChange('center')} className={`p-1 rounded-full ${textAlign === 'center' ? 'bg-cyan-500' : 'hover:bg-white/20'}`}><AlignCenterIcon className="w-4 h-4" /></button>
              <button onClick={() => handleTextAlignChange('right')} className={`p-1 rounded-full ${textAlign === 'right' ? 'bg-cyan-500' : 'hover:bg-white/20'}`}><AlignRightIcon className="w-4 h-4" /></button>
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
            style={{ 
                fontFamily: currentTitleFontFamily, 
                fontSize: `${titleFontSize}rem`, 
                lineHeight: 1.2, 
                textAlign: textAlign,
                fontWeight: isTitleBold ? 'bold' : 'normal',
                fontStyle: isTitleItalic ? 'italic' : 'normal',
            }}
            className="w-full bg-transparent drop-shadow-lg focus:outline-none focus:bg-black/20 rounded-md px-2 py-1 transition-colors"
            disabled={!isEditable}
        />
        <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onBlur={handleBodyBlur}
            aria-label="Corpo do slide"
            style={{ 
                fontFamily: currentBodyFontFamily,
                fontSize: `${bodyFontSize}rem`,
                lineHeight: 1.6,
                textAlign: textAlign,
                fontWeight: isBodyBold ? 'bold' : 'normal',
                fontStyle: isBodyItalic ? 'italic' : 'normal',
            }}
            className="w-full bg-transparent leading-relaxed drop-shadow-lg resize-none focus:outline-none focus:bg-black/20 rounded-md px-2 py-1 transition-colors mt-4"
            rows={3}
            disabled={!isEditable}
        />
      </div>
    </div>
  );
};

export default EditableSlide;
