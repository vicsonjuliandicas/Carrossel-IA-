
import React from 'react';
import type { Slide } from '../types';
import { downloadCarouselAsZip } from '../utils/downloadUtils';
import DownloadIcon from './icons/DownloadIcon';

interface DownloadButtonProps {
  slides: Slide[];
  isDownloading: boolean;
  onDownloadStart: () => void;
  onDownloadEnd: () => void;
  onDownloadError: (message: string) => void;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  slides,
  isDownloading,
  onDownloadStart,
  onDownloadEnd,
  onDownloadError,
}) => {

  const handleDownload = async () => {
    if (isDownloading || slides.length === 0) return;

    onDownloadStart();
    try {
      await downloadCarouselAsZip(slides);
    } catch (error) {
      console.error("Falha ao baixar o carrossel:", error);
      onDownloadError("Não foi possível gerar o arquivo de download. Tente novamente.");
    } finally {
      onDownloadEnd();
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/50"
    >
      <DownloadIcon className="w-5 h-5 mr-2" />
      {isDownloading ? 'Preparando Download...' : 'Baixar Carrossel (.zip)'}
    </button>
  );
};

export default DownloadButton;