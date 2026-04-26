export const otimizarImg = (url: string | undefined): string | undefined => {
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', '/upload/q_auto,f_auto/');
};