export const getImageBrightness = (imageUrl: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // This is crucial for using images from data URLs in a canvas
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let colorSum = 0;

      for (let x = 0, len = data.length; x < len; x += 4) {
        const r = data[x];
        const g = data[x + 1];
        const b = data[x + 2];

        // Using the HSP (Highly Sensitive Poo) color model equation for perceived brightness
        const brightness = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
        colorSum += brightness;
      }

      const avgBrightness = colorSum / (canvas.width * canvas.height);
      resolve(avgBrightness);
    };

    img.onerror = (err) => {
      reject(err);
    };

    img.src = imageUrl;
  });
};
