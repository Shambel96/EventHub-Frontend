/**
 * Converts minutes (number) to a readable string like "2 hours" or "45 mins".
 */
export const formatDuration = (minutes: number | string | undefined | null): string => {
  if (minutes === undefined || minutes === null) return 'N/A';
  const min = typeof minutes === 'string' ? parseInt(minutes) : minutes;
  if (isNaN(min)) return minutes.toString();

  if (min < 60) return `${min} mins`;
  
  const hours = Math.floor(min / 60);
  const remainingMinutes = min % 60;
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (days > 0) {
    let res = `${days} day${days > 1 ? 's' : ''}`;
    if (remainingHours > 0) res += ` ${remainingHours} hour${remainingHours > 1 ? 's' : ''}`;
    return res;
  }

  if (remainingMinutes === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} mins`;
};

/**
 * Converts a string like "2 hours" or "120" back to minutes (number).
 */
export const parseDuration = (durationStr: string): number => {
  if (!durationStr) return 0;
  
  // If it's just a number string
  if (/^\d+$/.test(durationStr.trim())) {
    return parseInt(durationStr.trim());
  }

  const daysMatch = durationStr.match(/(\d+)\s*day/i);
  const hoursMatch = durationStr.match(/(\d+)\s*hour/i);
  const minsMatch = durationStr.match(/(\d+)\s*min/i);
  
  let totalMinutes = 0;
  if (daysMatch && daysMatch[1]) totalMinutes += parseInt(daysMatch[1]) * 24 * 60;
  if (hoursMatch && hoursMatch[1]) totalMinutes += parseInt(hoursMatch[1]) * 60;
  if (minsMatch && minsMatch[1]) totalMinutes += parseInt(minsMatch[1]);
  
  return totalMinutes;
};
