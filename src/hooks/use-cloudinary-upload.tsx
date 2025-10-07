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
          isCopied: false,
        });
      } else {
        console.error("Invalid upload response:", resultsInfo ?? "undefined");
      }
    },
    []
  );

  const UploadButton = ({ label }: { label: string }) => {
    // Debug: Check if upload preset is available
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!uploadPreset) {
      console.error("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET is not defined");
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
      <CldUploadWidget
        uploadPreset={uploadPreset}
        onSuccess={handleSuccess}
        onError={(error) => {
          console.error("Upload error:", error);
        }}
      >
        {({ open }) => {
          const isReady = open && typeof open === "function";

          return (
            <button
              type="button"
              className={`border-2 rounded-xl px-4 py-2 font-bold transition-all ${
                isReady
                  ? "bg-white text-purple-700 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:bg-purple-100 cursor-pointer"
                  : "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed"
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                if (isReady) {
                  try {
                    open();
                  } catch (error) {
                    console.error("Error opening upload widget:", error);
                  }
                } else {
                  console.warn("Upload widget not ready");
                }
              }}
              disabled={!isReady}
            >
              {isReady ? label : "Loading..."}
            </button>
          );
        }}
      </CldUploadWidget>
    );
  };

  return { uploadedFile, UploadButton };
};
