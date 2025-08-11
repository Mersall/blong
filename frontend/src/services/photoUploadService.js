/**
 * BLONG Photo Upload Service
 * Comprehensive photo management system with cloud storage integration
 */

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { apiService } from './apiService';
import { photoValidation } from '../utils/profileValidation';

/**
 * Photo upload configuration
 */
const PHOTO_CONFIG = {
  // Image processing settings
  quality: 0.8,
  format: ImageManipulator.SaveFormat.JPEG,
  
  // Size variants for different use cases
  sizes: {
    thumbnail: { width: 150, height: 150 },
    preview: { width: 400, height: 400 },
    full: { width: 800, height: 800 }
  },
  
  // Upload settings
  maxRetries: 3,
  timeout: 30000,
  
  // Compression settings
  compressionQuality: 0.85,
  maxFileSize: 2 * 1024 * 1024 // 2MB after compression
};

/**
 * Photo Upload Service Class
 */
class PhotoUploadService {
  constructor() {
    this.uploadQueue = [];
    this.isProcessing = false;
  }

  /**
   * Request camera and media library permissions
   */
  async requestPermissions() {
    try {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      return {
        camera: cameraStatus === 'granted',
        mediaLibrary: mediaStatus === 'granted',
        canUseCamera: cameraStatus === 'granted',
        canUseGallery: mediaStatus === 'granted'
      };
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return {
        camera: false,
        mediaLibrary: false,
        canUseCamera: false,
        canUseGallery: false
      };
    }
  }

  /**
   * Show image picker options
   */
  async pickImage(options = {}) {
    const {
      allowsEditing = true,
      aspect = [1, 1],
      quality = 1.0,
      source = 'both' // 'camera', 'gallery', or 'both'
    } = options;

    try {
      const permissions = await this.requestPermissions();
      
      let result;
      
      if (source === 'camera' && permissions.canUseCamera) {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing,
          aspect,
          quality,
          exif: false // Remove EXIF data for privacy
        });
      } else if (source === 'gallery' && permissions.canUseGallery) {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing,
          aspect,
          quality,
          exif: false // Remove EXIF data for privacy
        });
      } else {
        // Show action sheet for both options
        result = await this.showImagePickerActionSheet();
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        return result.assets[0];
      }
      
      return null;
    } catch (error) {
      console.error('Error picking image:', error);
      throw new Error('Failed to pick image. Please try again.');
    }
  }

  /**
   * Show action sheet for image source selection
   */
  async showImagePickerActionSheet() {
    // This would be implemented with a native action sheet
    // For now, defaulting to gallery
    const permissions = await this.requestPermissions();
    
    if (permissions.canUseGallery) {
      return await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1.0,
        exif: false
      });
    }
    
    throw new Error('No permission to access gallery');
  }

  /**
   * Process and optimize image
   */
  async processImage(imageUri, options = {}) {
    const {
      resize = true,
      compress = true,
      generateThumbnail = true
    } = options;

    try {
      console.log('🖼️ Processing image:', imageUri);
      
      // Get original image info
      const imageInfo = await FileSystem.getInfoAsync(imageUri);
      console.log('📊 Original image size:', imageInfo.size);

      let processedImages = {};
      
      // Generate different sizes
      if (resize) {
        // Full size (compressed)
        const fullImage = await ImageManipulator.manipulateAsync(
          imageUri,
          [
            { resize: PHOTO_CONFIG.sizes.full }
          ],
          {
            compress: PHOTO_CONFIG.compressionQuality,
            format: PHOTO_CONFIG.format,
            base64: false
          }
        );
        processedImages.full = fullImage;

        // Preview size
        const previewImage = await ImageManipulator.manipulateAsync(
          imageUri,
          [
            { resize: PHOTO_CONFIG.sizes.preview }
          ],
          {
            compress: PHOTO_CONFIG.compressionQuality,
            format: PHOTO_CONFIG.format,
            base64: false
          }
        );
        processedImages.preview = previewImage;

        // Thumbnail
        if (generateThumbnail) {
          const thumbnailImage = await ImageManipulator.manipulateAsync(
            imageUri,
            [
              { resize: PHOTO_CONFIG.sizes.thumbnail }
            ],
            {
              compress: 0.7,
              format: PHOTO_CONFIG.format,
              base64: false
            }
          );
          processedImages.thumbnail = thumbnailImage;
        }
      } else {
        // Just compress without resizing
        const compressedImage = await ImageManipulator.manipulateAsync(
          imageUri,
          [],
          {
            compress: PHOTO_CONFIG.compressionQuality,
            format: PHOTO_CONFIG.format,
            base64: false
          }
        );
        processedImages.full = compressedImage;
      }

      // Check final file sizes
      for (const [size, image] of Object.entries(processedImages)) {
        const info = await FileSystem.getInfoAsync(image.uri);
        console.log(`📐 ${size} image size:`, info.size);
        
        if (info.size > PHOTO_CONFIG.maxFileSize) {
          console.warn(`⚠️ ${size} image still too large:`, info.size);
          // Could implement additional compression here
        }
      }

      return processedImages;
    } catch (error) {
      console.error('❌ Error processing image:', error);
      throw new Error('Failed to process image. Please try again.');
    }
  }

  /**
   * Upload image to cloud storage
   */
  async uploadToCloud(imageUri, metadata = {}) {
    try {
      console.log('☁️ Uploading to cloud storage:', imageUri);
      
      // Create FormData for multipart upload
      const formData = new FormData();
      
      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      const filename = `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
      
      // Append file
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: filename
      });
      
      // Append metadata
      Object.keys(metadata).forEach(key => {
        formData.append(key, metadata[key]);
      });

      // Upload with progress tracking
      const response = await this.uploadWithProgress(formData, metadata.onProgress);
      
      console.log('✅ Cloud upload successful:', response);
      return response;
    } catch (error) {
      console.error('❌ Cloud upload failed:', error);
      throw new Error('Failed to upload image to cloud storage');
    }
  }

  /**
   * Upload with progress tracking
   */
  async uploadWithProgress(formData, onProgress = null) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // Progress tracking
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            onProgress(percentComplete);
          }
        });
      }
      
      // Success handler
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (parseError) {
            reject(new Error('Invalid response from server'));
          }
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });
      
      // Error handlers
      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });
      
      xhr.addEventListener('timeout', () => {
        reject(new Error('Upload timeout'));
      });
      
      // Configure request
      xhr.timeout = PHOTO_CONFIG.timeout;
      xhr.open('POST', `${apiService.baseURL}/profile/photos/upload`);
      
      // Add auth header
      apiService.getAuthHeaders().then(headers => {
        Object.keys(headers).forEach(key => {
          xhr.setRequestHeader(key, headers[key]);
        });
        
        // Send request
        xhr.send(formData);
      });
    });
  }

  /**
   * Complete photo upload process
   */
  async uploadPhoto(imageUri, options = {}) {
    const {
      isPrimary = false,
      description = '',
      onProgress = null,
      processImage = true
    } = options;

    try {
      console.log('🚀 Starting photo upload process');
      
      // Validate image first
      const imageInfo = await FileSystem.getInfoAsync(imageUri);
      const validation = photoValidation.validateFile({
        type: 'image/jpeg', // Assuming JPEG after processing
        size: imageInfo.size
      });
      
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Process image if needed
      let finalImageUri = imageUri;
      if (processImage) {
        const processedImages = await this.processImage(imageUri);
        finalImageUri = processedImages.full.uri;
      }

      // Upload to cloud storage
      const cloudResponse = await this.uploadToCloud(finalImageUri, {
        isPrimary,
        description,
        onProgress
      });

      // Save photo record to database
      const photoData = {
        url: cloudResponse.url,
        thumbnailUrl: cloudResponse.thumbnailUrl,
        isPrimary,
        description,
        fileSize: cloudResponse.fileSize,
        mimeType: cloudResponse.mimeType,
        width: cloudResponse.width,
        height: cloudResponse.height
      };

      const dbResponse = await apiService.post('/profile/photos', photoData);
      
      // Clean up temporary files
      if (processImage) {
        await this.cleanupTempFiles([finalImageUri]);
      }

      console.log('✅ Photo upload completed successfully');
      return dbResponse.data;
    } catch (error) {
      console.error('❌ Photo upload failed:', error);
      throw error;
    }
  }

  /**
   * Upload multiple photos
   */
  async uploadMultiplePhotos(imageUris, options = {}) {
    const {
      onProgress = null,
      onSingleComplete = null,
      maxConcurrent = 2
    } = options;

    const results = [];
    const errors = [];
    let completed = 0;

    try {
      // Process images in batches to avoid overwhelming the system
      for (let i = 0; i < imageUris.length; i += maxConcurrent) {
        const batch = imageUris.slice(i, i + maxConcurrent);
        
        const batchPromises = batch.map(async (uri, index) => {
          try {
            const result = await this.uploadPhoto(uri, {
              ...options,
              onProgress: (progress) => {
                const overallProgress = ((completed + (progress / 100)) / imageUris.length) * 100;
                onProgress?.(overallProgress);
              }
            });
            
            completed++;
            onSingleComplete?.(result, completed, imageUris.length);
            return result;
          } catch (error) {
            errors.push({ uri, error: error.message });
            completed++;
            return null;
          }
        });

        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults.filter(Boolean));
      }
      
      return {
        success: results,
        errors,
        total: imageUris.length,
        successful: results.length,
        failed: errors.length
      };
    } catch (error) {
      console.error('❌ Multiple photo upload failed:', error);
      throw error;
    }
  }

  /**
   * Delete photo
   */
  async deletePhoto(photoId) {
    try {
      console.log('🗑️ Deleting photo:', photoId);
      
      const response = await apiService.delete(`/profile/photos/${photoId}`);
      
      console.log('✅ Photo deleted successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Photo deletion failed:', error);
      throw new Error('Failed to delete photo');
    }
  }

  /**
   * Set primary photo
   */  
  async setPrimaryPhoto(photoId) {
    try {
      console.log('⭐ Setting primary photo:', photoId);
      
      const response = await apiService.put(`/profile/photos/${photoId}/primary`);
      
      console.log('✅ Primary photo set successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Setting primary photo failed:', error);
      throw new Error('Failed to set primary photo');
    }
  }

  /**
   * Reorder photos
   */
  async reorderPhotos(photoIds) {
    try {
      console.log('🔄 Reordering photos:', photoIds);
      
      const response = await apiService.put('/profile/photos/reorder', {
        photoIds
      });
      
      console.log('✅ Photos reordered successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Photo reordering failed:', error);
      throw new Error('Failed to reorder photos');
    }
  }

  /**
   * Get user's photos
   */
  async getUserPhotos() {
    try {
      const response = await apiService.get('/profile/photos');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to get user photos:', error);
      throw new Error('Failed to load photos');
    }
  }

  /**
   * Clean up temporary files
   */
  async cleanupTempFiles(uris) {
    try {
      await Promise.all(
        uris.map(async (uri) => {
          try {
            await FileSystem.deleteAsync(uri, { idempotent: true });
          } catch (error) {
            console.warn('⚠️ Failed to cleanup temp file:', uri, error);
          }
        })
      );
    } catch (error) {
      console.warn('⚠️ Cleanup failed:', error);
    }
  }

  /**
   * Check if user can upload more photos
   */
  async canUploadMore() {
    try {
      const photos = await this.getUserPhotos();
      return photoValidation.canUploadMore(photos.length);
    } catch (error) {
      console.error('❌ Failed to check upload limit:', error);
      return false;
    }
  }

  /**
   * Get remaining photo slots
   */
  async getRemainingSlots() {
    try {
      const photos = await this.getUserPhotos();
      return photoValidation.getRemainingSlots(photos.length);
    } catch (error) {
      console.error('❌ Failed to get remaining slots:', error);
      return 0;
    }
  }

  /**
   * Queue photo upload (useful for offline support)
   */
  queueUpload(imageUri, options = {}) {
    this.uploadQueue.push({
      id: Date.now() + Math.random(),
      imageUri,
      options,
      status: 'queued',
      attempts: 0
    });

    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  /**
   * Process upload queue
   */
  async processQueue() {
    if (this.isProcessing || this.uploadQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.uploadQueue.length > 0) {
      const upload = this.uploadQueue.shift();
      
      try {
        upload.status = 'processing';
        const result = await this.uploadPhoto(upload.imageUri, upload.options);
        upload.status = 'completed';
        upload.result = result;
      } catch (error) {
        upload.attempts++;
        upload.status = 'failed';
        upload.error = error.message;
        
        // Retry failed uploads up to max retries
        if (upload.attempts < PHOTO_CONFIG.maxRetries) {
          upload.status = 'queued';
          this.uploadQueue.push(upload);
        }
      }
    }

    this.isProcessing = false;
  }

  /**
   * Get upload queue status
   */
  getQueueStatus() {
    return {
      total: this.uploadQueue.length,
      queued: this.uploadQueue.filter(u => u.status === 'queued').length,
      processing: this.uploadQueue.filter(u => u.status === 'processing').length,
      completed: this.uploadQueue.filter(u => u.status === 'completed').length,
      failed: this.uploadQueue.filter(u => u.status === 'failed').length,
      isProcessing: this.isProcessing
    };
  }
}

// Export singleton instance
export const photoUploadService = new PhotoUploadService();
export default photoUploadService;