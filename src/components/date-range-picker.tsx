import { useRef, useState, useEffect, useCallback } from "react";
import clsx from "clsx";

import { Calendar } from "./calendar";
import { CalendarIcon } from "./icons/calendar-icon";
import {
  getNewDateWithoutTime,
  formatDate,
  getFormattedRange,
  getWeekendsInRange,
} from "../helpers/functions";

const placeholder = "yyyy-MM-dd ~ yyyy-MM-dd";

export type DateRangePickerProps = Readonly<{
  onChange: (value: [string[], string[]]) => void;
  ranges?: Array<{
    label: string;
    value: Date[];
  }>;
}>;

export const DateRangePicker = ({ onChange, ranges }: DateRangePickerProps) => {
  const container = useRef<HTMLDivElement>(null);
  const previousAction = useRef<"increment" | "decrement">("increment");

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [stopDate, setStopDate] = useState<Date | null>(null);
  const [value, setValue] = useState("");
  const [draft, setDraft] = useState(placeholder);
  const [isFocused, setIsFocused] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const [calendar1Date, setCalendar1Date] = useState(() => {
    const date = getNewDateWithoutTime();
    date.setDate(1);
    return date;
  });
  const [calendar2Date, setCalendar2Date] = useState(() => {
    const date = getNewDateWithoutTime();
    date.setDate(1);
    date.setMonth(date.getMonth() + 1);
    return date;
  });

  const openDatePicker = () => setIsDatePickerOpen(true);
  const closeDatePicker = () => setIsDatePickerOpen(false);

  const focus = () => {
    setIsFocused(true);
    openDatePicker();
  };
  const blur = useCallback(() => {
    setIsFocused(false);
    closeDatePicker();
  }, []);

  useEffect(() => {
    const handleBlur = (event: MouseEvent) => {
      if (!container.current?.contains(event.target as Node)) blur();
    };

    document.addEventListener("mousedown", handleBlur);
    return () => document.removeEventListener("mousedown", handleBlur);
  }, [blur]);

  const handleMonthIncrement = (
    setter: (value: React.SetStateAction<Date>) => void,
  ) => {
    previousAction.current = "increment";
    setter((value) => {
      const date = new Date(value);
      date.setMonth(date.getMonth() + 1);
      return date;
    });
  };

  const handleMonthDecrement = (
    setter: (value: React.SetStateAction<Date>) => void,
  ) => {
    previousAction.current = "decrement";
    setter((value) => {
      const date = new Date(value);
      date.setMonth(date.getMonth() - 1);
      return date;
    });
  };

  const handleDateSelect = (date: Date) => {
    const day = date.getDay();
    if (day === 0 || day === 6) return;

    if (!startDate) {
      setStartDate(date);
      setStopDate(date);
    } else if (date.toDateString() === startDate.toDateString()) {
      setStartDate(null);
      setStopDate(null);
    } else if (date.getTime() < startDate.getTime()) {
      setStartDate(date);
    } else setStopDate(date);
  };

  useEffect(() => {
    if (calendar1Date.toDateString() === calendar2Date.toDateString()) {
      if (previousAction.current === "increment")
        handleMonthIncrement(setCalendar2Date);
      else handleMonthDecrement(setCalendar1Date);
    }
  }, [calendar1Date, calendar2Date]);

  useEffect(() => {
    setDraft(getFormattedRange(startDate, stopDate));
  }, [startDate, stopDate]);

  const handleRangeSelect = (range: Date[]) => {
    const startDay = range[0].getDay();
    const stopDay = range[1].getDay();
    if (startDay === 0 || startDay === 6 || stopDay === 0 || stopDay === 6) {
      return;
    }

    setStartDate(range[0]);
    setStopDate(range[1]);
    const draft = getFormattedRange(range[0], range[1]);
    setDraft(draft);
    setValue(draft);

    onChange([
      [formatDate(range[0]), formatDate(range[1])],
      getWeekendsInRange(range[0], range[1]),
    ]);
    blur();
  };

  const handleSubmit = () => {
    if (!startDate || !stopDate) return;
    setValue(draft);

    onChange([
      [formatDate(startDate), formatDate(stopDate)],
      getWeekendsInRange(startDate, stopDate),
    ]);
    blur();
  };

  return (
    <div
      ref={container}
      className={clsx(
        "relative flex h-9 w-64 items-center rounded-md border bg-zinc-900 transition-all duration-200 hover:border-sky-400",
        { "border-sky-400": isFocused, "border-zinc-700": !isFocused },
      )}
    >
      <input
        placeholder={placeholder}
        value={value}
        readOnly
        onFocus={focus}
        spellCheck={false}
        className="flex-grow bg-transparent py-2 pl-3 text-sm text-zinc-200 outline-none placeholder:text-zinc-400"
      />
      <button
        onFocus={focus}
        className={clsx(
          "flex h-full w-8 flex-shrink-0 items-center justify-center outline-none",
          {
            "cursor-pointer": value && value !== placeholder,
            "cursor-text": !value || value === placeholder,
          },
        )}
      >
        <CalendarIcon className="h-4 w-4 fill-zinc-400" />
      </button>

      <div
        className={clsx(
          "absolute -left-px top-full mt-px min-w-[34rem] rounded-md bg-zinc-800 shadow",
          { hidden: !isFocused || !isDatePickerOpen },
        )}
      >
        <header className="px-3 py-2 text-sm">{draft}</header>

        <section className="grid grid-cols-2 border-b border-t border-zinc-700">
          <div className="border-r border-zinc-700 pb-4 pt-3">
            <Calendar
              date={calendar1Date}
              startDate={startDate}
              stopDate={stopDate}
              onMonthIncrement={() => handleMonthIncrement(setCalendar1Date)}
              onMonthDecrement={() => handleMonthDecrement(setCalendar1Date)}
              onDateSelect={handleDateSelect}
            />
          </div>
          <div className="py-3">
            <Calendar
              date={calendar2Date}
              startDate={startDate}
              stopDate={stopDate}
              onMonthIncrement={() => handleMonthIncrement(setCalendar2Date)}
              onMonthDecrement={() => handleMonthDecrement(setCalendar2Date)}
              onDateSelect={handleDateSelect}
            />
          </div>
        </section>

        <footer className="flex items-start justify-between p-3">
          <div className="flex max-w-[400px] flex-grow flex-wrap gap-1">
            {ranges?.map((range) => (
              <button
                key={range.label}
                onClick={() => handleRangeSelect(range.value)}
                className="px-2.5 py-[5px] text-sm text-sky-400 hover:underline"
              >
                {range.label}
              </button>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            disabled={!startDate || !stopDate}
            className="rounded-md bg-sky-500 px-2.5 py-[5px] text-sm text-white transition-all duration-200 hover:bg-sky-400 disabled:opacity-40 disabled:hover:bg-sky-500"
          >
            OK
          </button>
        </footer>
      </div>
    </div>
  );
};
