import React, { useState, useCallback } from 'react';
import Cropper from 'react-cropper';
import type { Cropper as CropperType } from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { profileService } from '../services/profileService';
import { toast } from 'react-toastify';

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl?: string;
  onAvatarUpdate?: (avatarUrl: string) => void;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  userId,
  currentAvatarUrl,
  onAvatarUpdate,
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [cropper, setCropper] = useState<CropperType | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = useCallback(async () => {
    if (!cropper) return;

    setLoading(true);
    try {
      const canvas = cropper.getCroppedCanvas();
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b: Blob | null) => resolve(b as Blob), 'image/jpeg', 0.9);
      });
      
      const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
      const avatarUrl = await profileService.uploadAvatar(userId, file);
      
      toast.success('Avatar updated successfully');
      onAvatarUpdate?.(avatarUrl);
      setImage(null);
    } catch (error) {
      toast.error('Failed to update avatar');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [cropper, userId, onAvatarUpdate]);

  return (
    <div className="space-y-4">
      {!image && (
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <img
              src={currentAvatarUrl || '/default-avatar.png'}
              alt="Current avatar"
              className="h-32 w-32 rounded-full object-cover"
            />
          </div>
          <div>
            <label htmlFor="avatar-upload" className="block text-sm font-medium text-gray-700">
              Change Avatar
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              aria-label="Upload new avatar image"
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
          </div>
        </div>
      )}

      {image && (
        <div className="space-y-4">
          <Cropper
            src={image}
            style={{ height: 300, width: '100%' }}
            aspectRatio={1}
            guides={true}
            viewMode={1}
            dragMode="move"
            scalable={true}
            cropBoxMovable={true}
            cropBoxResizable={true}
            onInitialized={(instance) => setCropper(instance)}
          />
          <div className="flex space-x-2">
            <button
              onClick={() => setImage(null)}
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              onClick={handleCrop}
              disabled={loading}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 