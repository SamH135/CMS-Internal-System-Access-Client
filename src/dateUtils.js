// dateUtils.js

export const parseUTCDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  };
  
  export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = parseUTCDate(dateString);
    if (!date) return 'Invalid Date';
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'UTC'
    };
    return date.toLocaleDateString(undefined, options);
  };
  
  export const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const date = new Date(timeString);
    if (isNaN(date.getTime())) return 'Invalid Time';
    return date.toLocaleTimeString(undefined, { timeZone: 'UTC' });
  };
  
  export const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = parseUTCDate(dateString);
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };