/**
 * Client-side Image Compression & Cloud Uploader
 * Resizes large photos to optimal dimensions (max 1200px) and compresses to JPEG
 * Uploads to Supabase Storage via /api/upload
 */

export async function compressImage(file, maxWidth = 1200, maxHeight = 1200, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate new aspect ratio dimensions
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
          resolve(e.target.result);
          return;
        }

        // Draw and compress to JPEG
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export async function uploadImageToCloud(file, folder = 'uploads') {
  try {
    // 1. Compress image in browser first
    const compressedBase64 = await compressImage(file);

    // 2. Upload to Cloud via API
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: file.name || `photo_${Date.now()}.jpg`,
        base64Data: compressedBase64,
        folder
      })
    });

    if (res.ok) {
      const result = await res.json();
      if (result.url) {
        return result.url;
      }
    }

    console.warn('Cloud upload returned unexpected response, falling back to compressed base64');
    return compressedBase64;
  } catch (err) {
    console.error('Error during image upload, using compressed base64 fallback:', err);
    try {
      return await compressImage(file);
    } catch {
      return null;
    }
  }
}
