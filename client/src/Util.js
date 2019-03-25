export const getStartDateTimeInSeconds = (minutes, end) => Math.floor(end - (minutes * 60));
export const getEndDateTimeInSeconds = () => Math.floor(new Date().getTime() / 1000);
