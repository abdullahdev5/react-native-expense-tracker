import { FullMonthNames, MonthNames } from '../types/date';
import { DateTimeFormat } from '../types/date';


type toFormattedDateTimeParams = {
  format?: DateTimeFormat;
};

export const toFormattedDateTime = (
  date: string | number | Date,
  { format = 'MMM dd, yyyy' }: toFormattedDateTimeParams = {}
): string => {
  const d = new Date(date);

  const day = d.getDate();
  const month = d.getMonth(); // number - index (starts with 0)
  const year = d.getFullYear();
  const hour = d.getHours();
  const minutes = d.getMinutes();

  const monthNames = Object.values(MonthNames);
  const fullMonthNames = Object.values(FullMonthNames);

  const period = hour >= 12 ? 'p.m.' : 'a.m.';
  const hours12 = hour % 12 || 12;
  const displayHours = hours12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  const displayDay = day.toString().padStart(2, '0');
  const displayMonth = (month + 1).toString().padStart(2, '0');
  const displayYear = year;

  switch (format) {
    case 'dd, mm, yyyy':
      return `${displayDay}, ${displayMonth}, ${displayYear}`;

    case 'd, m, yyyy':
      return `${date}, ${month + 1}, ${displayYear}`;

    case 'mm, dd, yyyy':
      return `${displayMonth}, ${displayDay}, ${displayYear}`;

    case 'MMM dd, yyyy':
      return `${monthNames.at(month)} ${displayDay}, ${displayYear}`;

    case 'MMMM dd, yyyy':
      return `${fullMonthNames.at(month)} ${displayDay}, ${displayYear}`;

    case 'h:mm a.m/p.m. | MMM dd, yyyy':
      return `${displayHours}:${displayMinutes} ${period} | ${monthNames.at(
        month,
      )} ${displayDay}, ${displayYear}`;

    case 'h:mm a.m/p.m. | MMMM dd, yyyy':
      return `${displayHours}:${displayMinutes} ${period} | ${fullMonthNames.at(
        month,
      )} ${displayDay}, ${displayYear}`;
    
    case 'mm/dd':
      return `${displayMonth}/${displayDay}`

    case 'toISOString':
        return d.toISOString();

    default:
      return d.toDateString();
  }
};
