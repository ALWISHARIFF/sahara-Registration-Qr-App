// Convert any timestamp to East African Time (EAT - UTC+3)
export const toEATTime = (timestamp?: string): Date => {
  const date = timestamp ? new Date(timestamp) : new Date();
  
  // Create a new date object representing the same moment in EAT (UTC+3)
  // Get UTC time in milliseconds
  const utcTime = date.getTime() + (date.getTimezoneOffset() * 60000);
  // Add 3 hours (10800000 ms) for EAT
  const eatTime = new Date(utcTime + 10800000);
  
  return eatTime;
};

// Format time for display (12-hour format)
export const formatDisplayTime = (timestamp?: string): string => {
  if (!timestamp) return 'Unknown date';
  
  const eatDate = toEATTime(timestamp);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const month = months[eatDate.getMonth()];
  const day = eatDate.getDate();
  const year = eatDate.getFullYear();
  
  let hours = eatDate.getHours();
  const minutes = eatDate.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  
  return `${month} ${day}, ${year}, ${hours}:${minutes} ${ampm} EAT`;
};

// Format time for CSV (24-hour format)
export const formatCSVTime = (timestamp?: string): string => {
  if (!timestamp) return 'N/A';
  
  const eatDate = toEATTime(timestamp);
  
  const month = (eatDate.getMonth() + 1).toString().padStart(2, '0');
  const day = eatDate.getDate().toString().padStart(2, '0');
  const year = eatDate.getFullYear();
  const hours = eatDate.getHours().toString().padStart(2, '0');
  const minutes = eatDate.getMinutes().toString().padStart(2, '0');
  const seconds = eatDate.getSeconds().toString().padStart(2, '0');
  
  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds} EAT`;
};
