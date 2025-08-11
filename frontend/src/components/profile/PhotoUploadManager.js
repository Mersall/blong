/**
 * BLONG Photo Upload Manager Component
 * Comprehensive photo management UI with upload, reorder, and delete functionality
 */

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Alert, 
  ActivityIndicator,
  Animated,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { photoUploadService } from '../../services/photoUploadService';
import { photoValidation } from '../../utils/profileValidation';

const { width: screenWidth } = Dimensions.get('window');
const PHOTO_SIZE = (screenWidth - 60) / 3; // 3 photos per row with margins

const COLORS = {
  background: '#FFFFFF',
  surface: '#FAFAFA',
  text: '#0A0A0A',
  textSecondary: '#6B6B6B',
  textTertiary: '#9E9E9E',
  accent: '#FF6B35',
  border: '#E0E0E0',
  shadow: '#000000',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800'
};

const PhotoUploadManager = ({ 
  photos = [], 
  onPhotosChange, 
  maxPhotos = 6,
  required = false,
  title = "Your Photos"
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [draggedPhoto, setDraggedPhoto] = useState(null);
  const [fadeAnims] = useState(photos.map(() => new Animated.Value(1)));

  // Animation for new photos
  const fadeInPhoto = (index) => {
    Animated.timing(fadeAnims[index], {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Animation for deleted photos
  const fadeOutPhoto = (index, callback) => {
    Animated.timing(fadeAnims[index], {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(callback);
  };

  const canUploadMore = photos.length < maxPhotos;
  const remainingSlots = maxPhotos - photos.length;

  /**
   * Handle photo upload
   */
  const handleUploadPhoto = async () => {
    if (!canUploadMore) {
      Alert.alert(
        'Maximum Photos Reached',
        `You can only upload up to ${maxPhotos} photos.`,
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // Show action sheet for camera/gallery selection
      Alert.alert(
        'Add Photo',
        'Choose how you\'d like to add a photo',
        [
          { text: 'Camera', onPress: () => uploadFromSource('camera') },
          { text: 'Gallery', onPress: () => uploadFromSource('gallery') },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } catch (error) {
      console.error('Error showing photo options:', error);
    }
  };

  /**
   * Upload photo from specific source
   */
  const uploadFromSource = async (source) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Pick image
      const pickedImage = await photoUploadService.pickImage({ source });
      
      if (!pickedImage) {
        setIsUploading(false);
        return;
      }

      // Upload with progress tracking
      const uploadedPhoto = await photoUploadService.uploadPhoto(
        pickedImage.uri,
        {
          isPrimary: photos.length === 0, // First photo is primary by default
          onProgress: (progress) => setUploadProgress(progress)
        }
      );

      // Add to photos array
      const newPhotos = [...photos, uploadedPhoto];
      onPhotosChange(newPhotos);

      // Success feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Animate in the new photo
      const newIndex = newPhotos.length - 1;
      if (fadeAnims[newIndex]) {
        fadeAnims[newIndex].setValue(0);
        fadeInPhoto(newIndex);
      }

    } catch (error) {
      console.error('Photo upload error:', error);
      
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      Alert.alert(
        'Upload Failed',
        error.message || 'Failed to upload photo. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  /**
   * Handle photo deletion
   */
  const handleDeletePhoto = async (photoIndex, photo) => {
    try {
      Alert.alert(
        'Delete Photo',
        'Are you sure you want to delete this photo?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                
                // Animate out
                fadeOutPhoto(photoIndex, async () => {
                  // Delete from server
                  if (photo.id) {
                    await photoUploadService.deletePhoto(photo.id);
                  }
                  
                  // Remove from local array
                  const newPhotos = photos.filter((_, index) => index !== photoIndex);
                  onPhotosChange(newPhotos);
                  
                  // Success feedback
                  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                });
              } catch (error) {
                console.error('Photo deletion error:', error);
                Alert.alert('Error', 'Failed to delete photo. Please try again.');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error showing delete confirmation:', error);
    }
  };

  /**
   * Handle setting primary photo
   */
  const handleSetPrimary = async (photoIndex, photo) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // Update on server
      if (photo.id) {
        await photoUploadService.setPrimaryPhoto(photo.id);
      }
      
      // Update local state
      const newPhotos = photos.map((p, index) => ({
        ...p,
        isPrimary: index === photoIndex
      }));
      onPhotosChange(newPhotos);
      
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error setting primary photo:', error);
      Alert.alert('Error', 'Failed to set primary photo. Please try again.');
    }
  };

  /**
   * Render photo item
   */
  const renderPhotoItem = (photo, index) => {
    const isPrimary = photo.isPrimary || index === 0;
    
    return (
      <Animated.View
        key={photo.id || index}
        style={{
          opacity: fadeAnims[index] || 1,
          marginBottom: 12,
        }}
      >
        <View style={{
          width: PHOTO_SIZE,
          height: PHOTO_SIZE,
          borderRadius: 12,
          overflow: 'hidden',
          position: 'relative',
          borderWidth: isPrimary ? 2 : 1,
          borderColor: isPrimary ? COLORS.accent : COLORS.border,
        }}>
          {/* Photo Image */}
          <Image
            source={{ uri: photo.url || photo.uri }}
            style={{
              width: '100%',
              height: '100%',
            }}
            resizeMode="cover"
          />
          
          {/* Primary Badge */}
          {isPrimary && (
            <View style={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: COLORS.accent,
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 4,
            }}>
              <Text style={{
                color: 'white',
                fontSize: 10,
                fontWeight: '600',
              }}>
                PRIMARY
              </Text>
            </View>
          )}
          
          {/* Photo Actions */}
          <View style={{
            position: 'absolute',
            top: 8,
            right: 8,
            flexDirection: 'row',
            gap: 4,
          }}>
            {/* Set Primary Button */}
            {!isPrimary && (
              <TouchableOpacity
                onPress={() => handleSetPrimary(index, photo)}
                style={{
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  borderRadius: 16,
                  width: 32,
                  height: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="star" size={16} color="white" />
              </TouchableOpacity>
            )}
            
            {/* Delete Button */}
            <TouchableOpacity
              onPress={() => handleDeletePhoto(index, photo)}
              style={{
                backgroundColor: 'rgba(244,67,54,0.8)',
                borderRadius: 16,
                width: 32,
                height: 32,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="trash" size={16} color="white" />
            </TouchableOpacity>
          </View>
          
          {/* Loading Overlay */}
          {isUploading && index === photos.length - 1 && (
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <ActivityIndicator color="white" size="small" />
              <Text style={{
                color: 'white',
                fontSize: 12,
                marginTop: 4,
              }}>
                {Math.round(uploadProgress)}%
              </Text>
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  /**
   * Render add photo placeholder
   */
  const renderAddPhotoButton = () => {
    if (!canUploadMore) return null;
    
    return (
      <TouchableOpacity
        onPress={handleUploadPhoto}
        disabled={isUploading}
        style={{
          width: PHOTO_SIZE,
          height: PHOTO_SIZE,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: COLORS.border,
          borderStyle: 'dashed',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: COLORS.surface,
          marginBottom: 12,
          opacity: isUploading ? 0.5 : 1,
        }}
      >
        <Ionicons 
          name="add" 
          size={32} 
          color={COLORS.textSecondary} 
        />
        <Text style={{
          fontSize: 12,
          color: COLORS.textSecondary,
          textAlign: 'center',
          marginTop: 4,
        }}>
          Add Photo
        </Text>
        
        {isUploading && (
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255,255,255,0.8)',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 12,
          }}>
            <ActivityIndicator color={COLORS.accent} size="small" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ marginVertical: 24 }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
      }}>
        <View>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: COLORS.text,
            marginBottom: 4,
          }}>
            {title}
            {required && <Text style={{ color: COLORS.error }}> *</Text>}
          </Text>
          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
          }}>
            {photos.length} of {maxPhotos} photos • {remainingSlots} remaining
          </Text>
        </View>
        
        {canUploadMore && (
          <TouchableOpacity
            onPress={handleUploadPhoto}
            disabled={isUploading}
            style={{
              backgroundColor: COLORS.accent,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
              opacity: isUploading ? 0.5 : 1,
            }}
          >
            <Text style={{
              color: 'white',
              fontSize: 12,
              fontWeight: '500',
            }}>
              Add Photo
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Photos Grid */}
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}>
        {/* Existing Photos */}
        {photos.map((photo, index) => renderPhotoItem(photo, index))}
        
        {/* Add Photo Button */}
        {renderAddPhotoButton()}
      </View>

      {/* Upload Progress */}
      {isUploading && uploadProgress > 0 && (
        <View style={{
          marginTop: 16,
          backgroundColor: COLORS.surface,
          borderRadius: 8,
          padding: 12,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}>
            <Text style={{
              fontSize: 14,
              color: COLORS.text,
              fontWeight: '500',
            }}>
              Uploading Photo...
            </Text>
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
            }}>
              {Math.round(uploadProgress)}%
            </Text>
          </View>
          
          <View style={{
            height: 4,
            backgroundColor: COLORS.border,
            borderRadius: 2,
            overflow: 'hidden',
          }}>
            <Animated.View style={{
              height: '100%',
              backgroundColor: COLORS.accent,
              width: `${uploadProgress}%`,
            }} />
          </View>
        </View>
      )}

      {/* Help Text */}
      {photos.length === 0 && required && (
        <View style={{
          backgroundColor: COLORS.warning + '15',
          borderRadius: 8,
          padding: 12,
          marginTop: 16,
          borderLeftWidth: 4,
          borderLeftColor: COLORS.warning,
        }}>
          <Text style={{
            fontSize: 14,
            color: COLORS.text,
            fontWeight: '500',
            marginBottom: 4,
          }}>
            At least one photo is required
          </Text>
          <Text style={{
            fontSize: 12,
            color: COLORS.textSecondary,
            lineHeight: 16,
          }}>
            Add a clear, recent photo of yourself to help others recognize you on dates.
          </Text>
        </View>
      )}

      {/* Photo Tips */}
      {photos.length > 0 && photos.length < 3 && (
        <View style={{
          backgroundColor: COLORS.accent + '15',
          borderRadius: 8,
          padding: 12,
          marginTop: 16,
          borderLeftWidth: 4,
          borderLeftColor: COLORS.accent,
        }}>
          <Text style={{
            fontSize: 14,
            color: COLORS.text,
            fontWeight: '500',
            marginBottom: 4,
          }}>
            💡 Tip: Add more photos
          </Text>
          <Text style={{
            fontSize: 12,
            color: COLORS.textSecondary,
            lineHeight: 16,
          }}>
            Profiles with 3+ photos get 60% more engagement. Show different aspects of your personality!
          </Text>
        </View>
      )}
    </View>
  );
};

export default PhotoUploadManager;