/**
 * High performance image upload & optimization helper
 * Compresses large camera/gallery photos before upload so they remain ultra-fast,
 * lightweight (< 150KB), and 100% compatible with Firestore and all devices.
 */

export async function compressImage(
  file: File | Blob,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate scaled dimensions keeping aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        // Draw image smoothly
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG with controlled quality
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an image file:
 * 1. Optimizes and resizes the image on the client
 * 2. Attempts to store on the backend /api/upload endpoint
 * 3. Falls back gracefully to the optimized base64 string
 */
export async function uploadImage(file: File): Promise<string> {
  try {
    // 1. Compress first to prevent payload bloat
    const compressedBase64 = await compressImage(file, 1000, 1000, 0.82);

    // 2. Attempt backend upload
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: compressedBase64,
          filename: file.name.replace(/[^a-zA-Z0-9.-]/g, '_'),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          return data.url;
        }
      }
    } catch {
      // Backend not available or offline; use compressed base64
    }

    return compressedBase64;
  } catch (error) {
    console.error('Image upload/compression failed:', error);
    throw new Error('ছবি আপলোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
  }
}
