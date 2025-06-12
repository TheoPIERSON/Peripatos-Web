export const getRatingStars = (rating: number | null): string => {
  if (!rating) return '';
  
  // Pour 0, on affiche "⭐️" (liste d'envie)
  if (rating === 0) return "⭐️";
  
  // Pour 1 à 5, on affiche le nombre d'étoiles correspondant
  return '⭐️'.repeat(rating);
};
