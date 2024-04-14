import { useRef, useState, useEffect, useCallback } from "react";
import clsx from "clsx";

import { Calendar } from "./calendar";
import { CalendarIcon } from "./icons/calendar-icon";
import { getDateWithoutTime } from "../helpers/functions";

const placeholder = "yyyy-MM-dd ~ yyyy-MM-dd";

const formatDate = (date: Date) => {
  const dateNumber = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${dateNumber}`;
};

const getFormattedDate = (startDate: Date | null, stopDate: Date | null) => {
  let value = startDate ? `${formatDate(startDate)} ~ ` : "yyyy-MM-dd ~ ";
  value += stopDate ? formatDate(stopDate) : "yyyy-MM-dd";
  return value;
};

export type DateRangePickerProps = Readonly<{
  ranges?: Array<{
    label: string;
    value: Date[];
  }>;
}>;

export const DateRangePicker = ({ ranges }: DateRangePickerProps) => {
  const container = useRef<HTMLDivElement>(null);
  const previousAction = useRef<"increment" | "decrement">("increment");

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [stopDate, setStopDate] = useState<Date | null>(null);
  const [value, setValue] = useState("");
  const [draft, setDraft] = useState(placeholder);
  const [isFocused, setIsFocused] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const [date1, setDate1] = useState(() => {
    const date = getDateWithoutTime();
    date.setDate(1);
    return date;
  });
  const [date2, setDate2] = useState(() => {
    const date = getDateWithoutTime();
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
    if (date1.toDateString() === date2.toDateString()) {
      if (previousAction.current === "increment")
        handleMonthIncrement(setDate2);
      else handleMonthDecrement(setDate1);
    }
  }, [date1, date2]);

  useEffect(() => {
    setDraft(getFormattedDate(startDate, stopDate));
  }, [startDate, stopDate]);

  const handleInputFocus = () => {
    focus();
    if (!value) setValue(placeholder);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    closeDatePicker();
    setValue(event.target.value);
  };

  const handleInputBlur = () => {
    if (value === placeholder) setValue("");
  };

  const handleRangeSelect = (range: Date[]) => {
    const startDay = range[0].getDay();
    const stopDay = range[1].getDay();
    if (startDay === 0 || startDay === 6 || stopDay === 0 || stopDay === 6) {
      return;
    }

    setStartDate(range[0]);
    setStopDate(range[1]);
    const draft = getFormattedDate(range[0], range[1]);
    setDraft(draft);
    setValue(draft);
    blur();
  };

  const handleSubmit = () => {
    setValue(draft);
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
        onFocus={handleInputFocus}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
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
              date={date1}
              startDate={startDate}
              stopDate={stopDate}
              onMonthIncrement={() => handleMonthIncrement(setDate1)}
              onMonthDecrement={() => handleMonthDecrement(setDate1)}
              onDateSelect={handleDateSelect}
            />
          </div>
          <div className="py-3">
            <Calendar
              date={date2}
              startDate={startDate}
              stopDate={stopDate}
              onMonthIncrement={() => handleMonthIncrement(setDate2)}
              onMonthDecrement={() => handleMonthDecrement(setDate2)}
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
            className="rounded-md bg-sky-500 px-2.5 py-[5px] text-sm text-white transition-all duration-200 hover:bg-sky-400"
          >
            OK
          </button>
        </footer>
      </div>
    </div>
  );
};
