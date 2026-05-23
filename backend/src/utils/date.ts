export const formatDate = (date: Date): string => {
  return date.toISOString();
};

export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};
