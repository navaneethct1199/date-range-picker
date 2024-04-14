import { useRef, useMemo } from "react";
import clsx from "clsx";

import { ChevronLeftIcon } from "./icons/chevron-left-icon";
import { getDateWithoutTime } from "../helpers/functions";

const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

type DateCell = {
  dateObject: Date;
  key: string;
  day: number;
  date: number;
  month: number;
};

export type CalendarProps = Readonly<{
  date: Date;
  startDate: Date | null;
  stopDate: Date | null;
  onMonthIncrement: () => void;
  onMonthDecrement: () => void;
  onDateSelect: (date: Date) => void;
}>;

export const Calendar = ({
  date,
  startDate,
  stopDate,
  onMonthIncrement,
  onMonthDecrement,
  onDateSelect,
}: CalendarProps) => {
  const today = useRef(getDateWithoutTime());

  const [month, headerText, cells] = useMemo<
    [number, string, DateCell[]]
  >(() => {
    const dateCopy = new Date(date);
    dateCopy.setDate(1);

    const headerText = new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
    })
      .format(dateCopy)
      .split(" ")
      .join(", ");

    const day = dateCopy.getDay();
    const startingDate: Date = new Date(dateCopy);
    startingDate.setDate(startingDate.getDate() - day);

    const cells = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startingDate);
      date.setDate(date.getDate() + i);
      cells.push({
        dateObject: date,
        key: date.toDateString(),
        day: date.getDay(),
        date: date.getDate(),
        month: date.getMonth(),
      });
    }

    return [dateCopy.getMonth(), headerText, cells];
  }, [date]);

  return (
    <div>
      <header className="flex items-center justify-between px-3">
        <button
          onClick={onMonthDecrement}
          className="flex h-6 w-6 items-center justify-center rounded-md transition-all duration-200 hover:bg-zinc-700"
        >
          <ChevronLeftIcon className="h-3.5 w-3.5 fill-zinc-400" />
        </button>
        <button className="px-2 py-0.5 text-xs text-zinc-400 outline-none">
          {headerText}
        </button>
        <button
          onClick={onMonthIncrement}
          className="flex h-6 w-6 items-center justify-center rounded-md transition-all duration-200 hover:bg-zinc-700"
        >
          <ChevronLeftIcon className="h-3.5 w-3.5 rotate-180 fill-zinc-400" />
        </button>
      </header>

      <main className="grid grid-cols-7 gap-y-0.5 px-3 pt-1">
        {days.map((day) => (
          <span
            key={day}
            className="flex h-[30px] items-center justify-center text-xs text-zinc-400"
          >
            {day}
          </span>
        ))}
        {cells.map((cell) => {
          const isCellDisabled =
            cell.day === 0 || cell.day === 6 || cell.month !== month;

          return (
            <div
              key={cell.key}
              className="relative flex items-center justify-center"
            >
              <button
                onClick={() => onDateSelect(cell.dateObject)}
                className={clsx(
                  "peer z-10 h-[30px] w-[30px] rounded-md text-sm outline-none hover:bg-zinc-700 hover:text-zinc-200",
                  {
                    "text-zinc-600": isCellDisabled,
                    "text-zinc-200": !isCellDisabled,
                    "outline outline-1 outline-offset-0 outline-sky-400":
                      cell.dateObject.toDateString() ===
                      today.current.toDateString(),
                    "!bg-sky-500":
                      (cell.dateObject.toDateString() ===
                        startDate?.toDateString() ||
                        cell.dateObject.toDateString() ===
                          stopDate?.toDateString()) &&
                      !isCellDisabled,
                  },
                )}
              >
                {cell.date}
              </button>
              <div
                className={clsx(
                  "absolute h-5 w-full peer-hover:bg-transparent",
                  {
                    "bg-sky-800":
                      startDate &&
                      stopDate &&
                      cell.dateObject.getTime() > startDate.getTime() &&
                      cell.dateObject.getTime() < stopDate.getTime() &&
                      !isCellDisabled,
                  },
                )}
              />
            </div>
          );
        })}
      </main>
    </div>
  );
};
