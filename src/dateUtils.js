// src/dateUtils.js

// handles timezone conversions from UTC in the front end
// to ensure consistent and accurate dates being displayed to user


export const parseUTCDate = (dateString) => {
    return new Date(dateString + 'Z');
  };
  
export const formatDate = (dateString) => {
if (!dateString) return 'N/A';
const date = parseUTCDate(dateString);
const options = { year: 'numeric', month: 'long', day: 'numeric' };
return date.toLocaleDateString(undefined, options);
};

export const formatTime = (timeString) => {
if (!timeString) return 'N/A';
const date = parseUTCDate(timeString);
return date.toLocaleTimeString();
};

export const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = parseUTCDate(dateString);
    return date.toISOString().split('T')[0];
};