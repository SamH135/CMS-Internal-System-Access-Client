// dateUtils.js

export const parseUTCDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
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
  
  export const formatTime = (inputTimeString) => {
    const date = new Date(inputTimeString);
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timeZoneAbbr = getTimeZoneAbbreviation(timeZone, date);
    
    return `${formattedTime} (${timeZoneAbbr})`;
  };
  
  function getTimeZoneAbbreviation(timeZone, date) {
    const options = { timeZone, timeZoneName: 'short' };
    return new Intl.DateTimeFormat('en-US', options).formatToParts(date)
      .find(part => part.type === 'timeZoneName').value;
  }

  export const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = parseUTCDate(dateString);
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };


  export const getStartOfWeek = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    return new Date(d.setDate(diff));
  };
  
  export const getEndOfWeek = (date) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    const day = d.getDay();
    const diff = d.getDate() + (7 - day);
    return new Date(d.setDate(diff));
  };