import { format, formatDistanceToNow } from "date-fns";

export const formatTime = (date: Date): string => {
  return format(date, "HH:mm:ss");
};

export const formatDate = (date: Date): string => {
  return format(date, "MMM dd, yyyy");
};

export const formatDateTime = (date: Date): string => {
  return format(date, "MMM dd, yyyy HH:mm");
};

export const getTimeAgo = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true });
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins}m`;
  }

  return `${hours}h ${mins}m`;
};
