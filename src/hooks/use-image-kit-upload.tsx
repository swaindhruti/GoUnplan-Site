'use client';

import { useState, useCallback, useRef } from 'react';
import { uploadImageToImageKit } from '@/actions/image-kit/action';

export type UploadedFile = {
  secure_url: string;
  display_name?: string;
  isCopied?: boolean;
  fileId?: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  size?: number;
};

interface UploadOptions {
  folder?: string;
  tags?: string[];
  maxFileSize?: number;
  acceptedFormats?: string[];
}

export const useImageKitUpload = (options: UploadOptions = {}) => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (options.maxFileSize && file.size > options.maxFileSize) {
        return `File size exceeds ${(options.maxFileSize / 1024 / 1024).toFixed(2)}MB`;
      }

      if (options.acceptedFormats && options.acceptedFormats.length > 0) {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!fileExtension || !options.acceptedFormats.includes(fileExtension)) {
          return `Only ${options.acceptedFormats.join(', ')} files are allowed`;
        }
      }

      return null;
    },
    [options]
  );

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      console.log('Selected file:', file);
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setIsUploading(true);
      setError(null);
      setUploadProgress(10);

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);

        if (options.folder) {
          formData.append('folder', options.folder);
        }

        if (options.tags && options.tags.length > 0) {
          formData.append('tags', options.tags.join(','));
        }

        setUploadProgress(30);

        const result = await uploadImageToImageKit(formData);

        setUploadProgress(80);

        if (result.success && result.data) {
          setUploadedFile({
            secure_url: result.data.url,
            display_name: result.data.name,
            isCopied: false,
            fileId: result.data.fileId,
            thumbnailUrl: result.data.thumbnailUrl,
            width: result.data.width,
            height: result.data.height,
            size: result.data.size,
          });
          setUploadProgress(100);
          console.log('Upload successful:', result.data);
        } else {
          setError(result.error || 'Upload failed');
          console.error('Upload error:', result.error);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Upload failed';
        setError(errorMessage);
        console.error('Upload error:', err);
      } finally {
        setIsUploading(false);
        setTimeout(() => setUploadProgress(0), 1000);
        // Reset input
        if (event.target) {
          event.target.value = '';
        }
      }
    },
    [options, validateFile]
  );

  const openUploadDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const resetUpload = useCallback(() => {
    setUploadedFile(null);
    setError(null);
    setIsUploading(false);
    setUploadProgress(0);
  }, []);

  const UploadButton = ({ label }: { label: string }) => {
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

    if (!urlEndpoint) {
      console.error('NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT is not defined');
      return (
        <button
          type="button"
          className="bg-red-300 text-red-700 border-2 border-red-400 rounded-xl px-4 py-2 font-bold cursor-not-allowed"
          disabled
        >
          Config Error
        </button>
      );
    }

    return (
      <>
        <input
          ref={fileInputRef}
          type="file"
          accept={
            options.acceptedFormats
              ? options.acceptedFormats.map(f => `.${f}`).join(',')
              : 'image/*'
          }
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
        <button
          type="button"
          className={`border-2 rounded-xl px-4 py-2 font-bold transition-all ${
            isUploading
              ? 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
              : 'bg-white text-purple-700 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:bg-purple-100 cursor-pointer'
          }`}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            if (!isUploading) {
              openUploadDialog();
            }
          }}
          disabled={isUploading}
        >
          {isUploading ? (
            <span className="flex items-center gap-2">
              <span>Uploading...</span>
              {uploadProgress > 0 && <span className="text-xs">({uploadProgress}%)</span>}
            </span>
          ) : (
            label
          )}
        </button>

        {isUploading && uploadProgress > 0 && (
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </>
    );
  };

  return {
    uploadedFile,
    UploadButton,
    isUploading,
    uploadProgress,
    error,
    resetUpload,
    openUploadDialog,
  };
};
