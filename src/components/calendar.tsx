import { useMemo } from "react";
import clsx from "clsx";

const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

type DateCell = {
  object: Date;
  key: string;
  day: number;
  date: number;
  month: number;
};

export type CalendarProps = Readonly<{
  date: Date;
  incrementMonth: () => void;
  decrementMonth: () => void;
}>;

export const Calendar = ({
  date,
  incrementMonth,
  decrementMonth,
}: CalendarProps) => {
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
        object: date,
        key: date.toISOString(),
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
          onClick={decrementMonth}
          className="h-6 w-6 rounded-md hover:bg-zinc-700"
        ></button>
        <button className="px-2 py-0.5 text-xs text-zinc-400 outline-none">
          {headerText}
        </button>
        <button
          onClick={incrementMonth}
          className="h-6 w-6 rounded-md hover:bg-zinc-700"
        ></button>
      </header>

      <main className="grid grid-cols-7 place-items-center px-3 pt-1">
        {days.map((day) => (
          <span
            key={day}
            className="flex h-[30px] items-center justify-center text-xs text-zinc-400"
          >
            {day}
          </span>
        ))}
        {cells.map((cell) => (
          <button
            key={cell.key}
            className={clsx(
              "h-[30px] w-[30px] rounded-md text-sm hover:bg-zinc-700 hover:text-zinc-200",
              {
                "text-zinc-600":
                  cell.day === 0 || cell.day === 6 || cell.month !== month,
                "text-zinc-200":
                  cell.day !== 0 && cell.day !== 6 && cell.month === month,
              },
            )}
          >
            {cell.date}
          </button>
        ))}
      </main>
    </div>
  );
};
