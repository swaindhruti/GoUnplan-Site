'use server';

import { imagekit } from '@/lib/imagekit';
import {
  ActionResponse,
  AuthParams,
  ImageKitUploadResponse,
  UploadedImageData,
} from '@/types/imagekit';
// import { ActionResponse, AuthParams, ImageKitResponse } from '@/types/imagekit';

export async function getImageKitAuth(): Promise<ActionResponse<AuthParams>> {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    return { success: true, data: authParams };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

function toUploadedImageData(response: ImageKitUploadResponse): UploadedImageData {
  return {
    fileId: response.fileId,
    name: response.name,
    url: response.url,
    thumbnailUrl: response.thumbnailUrl,
    filePath: response.filePath,
    height: response.height,
    width: response.width,
    size: response.size,
    fileType: response.fileType,
  };
}

// Upload image from server
export async function uploadImageToImageKit(
  formData: FormData
): Promise<ActionResponse<UploadedImageData>> {
  try {
    const file = formData.get('file') as File | null;

    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    const fileName = (formData.get('fileName') as string) || file.name;
    const folder = (formData.get('folder') as string) || '/';
    const tags = formData.get('tags') as string;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await imagekit.upload({
      file: buffer,
      fileName: fileName,
      folder: folder,
      useUniqueFileName: true,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : undefined,
    });

    return {
      success: true,
      data: toUploadedImageData(result),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Upload failed';
    return { success: false, error: errorMessage };
  }
}
// Delete image
// export async function deleteImageFromImageKit(fileId) {
//   try {
//     await imagekit.deleteFile(fileId);
//     return { success: true, message: 'Image deleted successfully' };
//   } catch (error) {
//     return { success: false, error: error.message };
//   }
// }

// Get file details
// export async function getImageDetails(fileId) {
//   try {
//     const result = await imagekit.getFileDetails(fileId);
//     return { success: true, data: result };
//   } catch (error) {
//     return { success: false, error: error.message };
//   }
// }

// // List all files
// export async function listImages(options = {}) {
//   try {
//     const result = await imagekit.listFiles({
//       skip: options.skip || 0,
//       limit: options.limit || 100,
//       searchQuery: options.searchQuery || '',
//     });
//     return { success: true, data: result };
//   } catch (error) {
//     return { success: false, error: error.message };
//   }
// }

// // Update file details
// export async function updateImageDetails(fileId, updates) {
//   try {
//     const result = await imagekit.updateFileDetails(fileId, {
//       tags: updates.tags,
//       customCoordinates: updates.customCoordinates,
//     });
//     return { success: true, data: result };
//   } catch (error) {
//     return { success: false, error: error.message };
//   }
// }
