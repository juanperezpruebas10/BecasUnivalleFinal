// Convertir imagen URL a base64 en formato JPEG (más compatible)
export const imageToBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      // Convertir a JPEG en lugar de PNG (más compatible con jsPDF)
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = reject;
    img.src = url;
  });
};

// Cargar logo de Univalle
export const getUnivalleLogo = async () => {
  try {
    // Intentar varias rutas posibles
    const rutas = [
      '/logo-univalle.png',
      '/logo-univalle.jpg',
      '/logo-univalle.jpeg',
      '/logo.png',
      '/logo.jpg'
    ];
    
    for (const ruta of rutas) {
      try {
        const response = await fetch(ruta);
        if (response.ok) {
          const blob = await response.blob();
          const base64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
          // Convertir a JPEG
          const img = new Image();
          await new Promise((resolve) => {
            img.onload = resolve;
            img.src = base64;
          });
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          return canvas.toDataURL('image/jpeg', 0.8);
        }
      } catch (e) {
        continue;
      }
    }
    return null;
  } catch (e) {
    console.log('Error cargando logo Univalle:', e);
    return null;
  }
};

// Cargar logo de beca
export const getBecaLogo = async (logoPath) => {
  if (!logoPath) return null;
  try {
    const response = await fetch(`http://localhost:5000${logoPath}`);
    if (!response.ok) return null;
    const blob = await response.blob();
    const base64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
    // Convertir a JPEG
    const img = new Image();
    await new Promise((resolve) => {
      img.onload = resolve;
      img.src = base64;
    });
    const canvas = document.createElement('canvas');
    canvas.width = 30;
    canvas.height = 30;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, 30, 30);
    return canvas.toDataURL('image/jpeg', 0.8);
  } catch (e) {
    console.log('Error cargando logo de beca:', e);
    return null;
  }
};