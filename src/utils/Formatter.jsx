import { format } from 'date-fns';

export const formatDate = (inputDate) => {
  if (!inputDate) return '';
  try {
      return format(inputDate, 'dd-MM-yyyy');
  } catch (error) {
    console.error('Error formatting date:', error.message);
    return 'Invalid date';
  }
};