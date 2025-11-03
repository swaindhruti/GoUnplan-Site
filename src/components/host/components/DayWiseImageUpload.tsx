'use client';

import { useEffect } from 'react';
import { useImageKitUpload } from '@/hooks/use-image-kit-upload';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Camera, X } from 'lucide-react';
import Image from 'next/image';

interface DayWiseImageUploadProps {
  dayIndex: number;
  currentImage: string | undefined;
  onImageChange: (imageUrl: string) => void;
  onImageRemove: () => void;
}

export const DayWiseImageUpload = ({
  dayIndex,
  currentImage,
  onImageChange,
  onImageRemove,
}: DayWiseImageUploadProps) => {
  const { uploadedFile, UploadButton, resetUpload } = useImageKitUpload({
    folder: `/day-${dayIndex + 1}`,
  });

  useEffect(() => {
    if (uploadedFile?.secure_url) {
      onImageChange(uploadedFile.secure_url);
    }
  }, [uploadedFile, onImageChange]);

  const handleRemove = () => {
    resetUpload();
    onImageRemove();
  };

  if (!currentImage) {
    return (
      <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Camera className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-xs text-muted-foreground mb-3 text-center font-instrument">
            Add an image for this day&apos;s activities
          </p>
          <UploadButton label="Choose Image" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative group">
        <AspectRatio ratio={4 / 3} className="bg-muted">
          <Image
            fill
            src={currentImage}
            alt={`Day ${dayIndex + 1} image`}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </AspectRatio>
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="flex gap-2">
            <UploadButton label="Change Image" />
            <Button
              type="button"
              onClick={handleRemove}
              variant="destructive"
              size="sm"
              className="absolute right-2 top-2 font-instrument border-2 rounded-xl !px-8 !py-6 font-bold transition-all bg-red-600 text-white text-base border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:bg-red-600/80 cursor-pointer"
            >
              <X size={20} strokeWidth={5} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
