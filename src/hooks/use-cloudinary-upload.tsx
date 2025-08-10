"use client";
import { useState, useCallback } from "react";
import { CldUploadWidget } from "next-cloudinary";

export type UploadedFile = {
  secure_url: string;
  display_name?: string;
  isCopied?: boolean;
};

import type { CloudinaryUploadWidgetResults } from "next-cloudinary";

export const useCloudinaryUpload = () => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

  const handleSuccess = useCallback(
    (results: CloudinaryUploadWidgetResults) => {
      const resultsInfo = results.info;
      if (
        resultsInfo &&
        typeof resultsInfo === "object" &&
        typeof resultsInfo.secure_url === "string"
      ) {
        setUploadedFile({
          secure_url: resultsInfo.secure_url,
          display_name: resultsInfo.original_filename ?? "",
          isCopied: false
        });
        console.log("Upload successful:", resultsInfo);
      } else {
        console.error("Invalid upload response:", resultsInfo ?? "undefined");
      }
    },
    []
  );

  const UploadButton = ({ label }: { label: string }) => (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!}
      onSuccess={handleSuccess}
      onError={(error) => {
        console.error("Upload error:", error);
      }}
    >
      {({ open }) => {
        // Add null check for the open function
        if (!open) {
          console.warn("Cloudinary upload widget not ready");
          return (
            <button
              type="button"
              className="bg-gray-300 text-gray-500 border-2 border-gray-400 rounded-xl px-4 py-2 font-bold cursor-not-allowed"
              disabled
            >
              Loading...
            </button>
          );
        }

        return (
          <button
            type="button"
            className="bg-white text-purple-700 border-2 border-black rounded-xl px-4 py-2 font-bold shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:bg-purple-100 transition-all"
            onClick={() => {
              try {
                open();
              } catch (error) {
                console.error("Error opening upload widget:", error);
              }
            }}
          >
            {label}
          </button>
        );
      }}
    </CldUploadWidget>
  );

  return { uploadedFile, UploadButton };
};
