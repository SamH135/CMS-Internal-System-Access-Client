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
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  export const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = parseUTCDate(dateString);
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };