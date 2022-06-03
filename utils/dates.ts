import { format, isToday, isTomorrow } from "date-fns";

export const toHumanDate = (dateString: string) => {
  const date = new Date(dateString);

  if (isToday(date)) {
    return "today"; // TODO: use locale
  } else if (isTomorrow(date)) {
    return "tomorrow";
  } else {
    return format(date, "MMM d, y");
  }
};
