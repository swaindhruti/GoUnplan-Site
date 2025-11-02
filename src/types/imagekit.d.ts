import type { UploadResponse, FileObject } from 'imagekit/dist/libs/interfaces';

// Use the SDK's native types
export type ImageKitUploadResponse = UploadResponse;
export type ImageKitFileObject = FileObject;

// Custom response wrapper
export interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ListFilesOptions {
  skip?: number;
  limit?: number;
  searchQuery?: string;
  fileType?: 'image' | 'non-image' | 'all';
  tags?: string[];
  sort?: 'ASC_CREATED' | 'DESC_CREATED' | 'ASC_NAME' | 'DESC_NAME';
  path?: string;
}

export interface AuthParams {
  token: string;
  expire: number;
  signature: string;
}

export interface UpdateFileDetails {
  tags?: string[];
  customCoordinates?: string;
  removeAITags?: string[];
  webhookUrl?: string;
  extensions?: Array<{ name: string; options: Record<string, any> }>;
  customMetadata?: Record<string, any>;
}

// Simplified upload data for client use
export interface UploadedImageData {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  filePath: string;
  height?: number;
  width?: number;
  size: number;
  fileType: string;
}
