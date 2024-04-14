export const getNewDateWithoutTime = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const formatDate = (date: Date) => {
  const dateNumber = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${dateNumber}`;
};

export const getFormattedRange = (
  startDate: Date | null,
  stopDate: Date | null,
) => {
  let value = startDate ? `${formatDate(startDate)} ~ ` : "yyyy-MM-dd ~ ";
  value += stopDate ? formatDate(stopDate) : "yyyy-MM-dd";
  return value;
};

export const getWeekendsInRange = (startDate: Date, stopDate: Date) => {
  const weekends = [];
  const start = new Date(startDate);
  while (start.toDateString() !== stopDate.toDateString()) {
    const startDay = start.getDay();
    if (startDay === 0 || startDay === 6) weekends.push(formatDate(start));
    start.setDate(start.getDate() + 1);
  }
  return weekends;
};
