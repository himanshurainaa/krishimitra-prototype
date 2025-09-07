import React, { useState, useRef } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { analyzeCropImage } from '../services/geminiService';
import SpinnerIcon from './icons/SpinnerIcon';
import UploadIcon from './icons/UploadIcon';
import SparkleIcon from './icons/SparkleIcon';
import LeafIcon from './icons/LeafIcon';


const PestDetector: React.FC = () => {
  const { t } = useLocalization();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysis('');
      setError('');
      handleAnalysis(file);
    }
  };

  const handleAnalysis = async (file: File) => {
    setIsLoading(true);
    try {
      const result = await analyzeCropImage(file);
      setAnalysis(result);
    } catch (err) {
      setError(t('errorPestDetection'));
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Left Column: Upload */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-gray-300">
            <LeafIcon className="w-6 h-6 text-green-400"/>
            <span>{t('plantHealthTitle')}</span>
        </div>
        <div
            onClick={triggerFileSelect}
            className="relative flex flex-col items-center justify-center p-10 h-80 bg-[#1c2e26]/50 border-2 border-dashed border-green-700/50 rounded-2xl cursor-pointer hover:bg-green-900/20 transition-colors duration-300"
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />
            {previewUrl ? (
                <img src={previewUrl} alt="Crop preview" className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
            ) : (
                <>
                    <UploadIcon />
                    <p className="mt-4 font-semibold text-green-300">{t('uploadButton')}</p>
                    <p className="text-sm text-gray-400">PNG, JPG, WEBP</p>
                </>
            )}
        </div>
        <p className="text-center text-sm text-gray-400">{t('uploadInstruction')}</p>
      </div>
      
      {/* Right Column: Result */}
      <div className="bg-[#1c2e26] rounded-2xl p-6 h-full flex flex-col justify-center items-center border border-green-500/10 shadow-lg">
          {isLoading ? (
               <div className="flex flex-col items-center justify-center text-center">
                    <SpinnerIcon />
                    <p className="mt-4 text-lg font-semibold text-green-300">{t('analyzing')}</p>
               </div>
          ) : error ? (
                <p className="text-red-400 font-semibold text-center">{error}</p>
          ) : analysis ? (
             <div className="w-full h-full overflow-y-auto">
                <h3 className="text-lg font-bold text-green-300 mb-2">{t('analysisResult')}</h3>
                <div className="prose prose-sm prose-invert max-w-none text-gray-300 whitespace-pre-wrap">{analysis}</div>
             </div>
          ) : (
            <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4">
                    <SparkleIcon />
                </div>
                <h3 className="text-xl font-bold text-white">{t('analysisAwaits')}</h3>
                <p className="text-gray-400 mt-2">{t('analysisAwaitsDesc')}</p>
            </div>
          )}
      </div>
    </div>
  );
};

export default PestDetector;
