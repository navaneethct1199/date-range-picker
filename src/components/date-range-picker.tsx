import { useRef, useState, useEffect, useCallback } from "react";
import clsx from "clsx";

import { Calendar } from "./calendar";

const placeholder = "yyyy-MM-dd ~ yyyy-MM-dd";

export type DateRangePickerProps = Readonly<{
  ranges: Array<{
    label: string;
    value: Date[];
  }>;
}>;

export const DateRangePicker = ({ ranges }: DateRangePickerProps) => {
  const container = useRef<HTMLDivElement>(null);
  const previousAction = useRef<"increment" | "decrement">("increment");

  const [displayValue, setDisplayValue] = useState("");
  const [draft] = useState(placeholder);
  const [isFocused, setIsFocused] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const [date1, setDate1] = useState(() => {
    const date = new Date();
    date.setDate(1);
    return date;
  });
  const [date2, setDate2] = useState(() => {
    const date = new Date();
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

  const incrementMonth = (
    setter: (value: React.SetStateAction<Date>) => void,
  ) => {
    previousAction.current = "increment";
    setter((value) => {
      const date = new Date(value);
      date.setMonth(date.getMonth() + 1);
      return date;
    });
  };

  const decrementMonth = (
    setter: (value: React.SetStateAction<Date>) => void,
  ) => {
    previousAction.current = "decrement";
    setter((value) => {
      const date = new Date(value);
      date.setMonth(date.getMonth() - 1);
      return date;
    });
  };

  useEffect(() => {
    if (date1.toDateString() === date2.toDateString()) {
      if (previousAction.current === "increment") incrementMonth(setDate2);
      else decrementMonth(setDate1);
    }
  }, [date1, date2]);

  const handleInputFocus = () => {
    focus();
    if (!displayValue) setDisplayValue(placeholder);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    closeDatePicker();
    setDisplayValue(event.target.value);
  };

  const handleInputBlur = () => {
    if (displayValue === placeholder) setDisplayValue("");
  };

  const handleRangeSelect = (range: Date[]) => {
    console.log(range);
    blur();
  };

  const handleSubmit = () => {
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
        value={displayValue}
        onFocus={handleInputFocus}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        spellCheck={false}
        className="flex-grow bg-transparent py-2 pl-3 text-sm text-zinc-200 outline-none placeholder:text-zinc-400"
      />
      <button
        onFocus={focus}
        className={clsx("h-full w-8 flex-shrink-0 outline-none", {
          "cursor-pointer": displayValue && displayValue !== placeholder,
          "cursor-text": !displayValue || displayValue === placeholder,
        })}
      ></button>

      <div
        className={clsx(
          "absolute -left-px top-full mt-px min-w-[36rem] rounded-md bg-zinc-800 shadow",
          { hidden: !isFocused || !isDatePickerOpen },
        )}
      >
        <header className="px-3 py-2 text-sm">{draft}</header>

        <section className="grid grid-cols-2 border-b border-t border-zinc-700">
          <div className="border-r border-zinc-700 pb-4 pt-3">
            <Calendar
              date={date1}
              incrementMonth={() => incrementMonth(setDate1)}
              decrementMonth={() => decrementMonth(setDate1)}
            />
          </div>
          <div className="py-3">
            <Calendar
              date={date2}
              incrementMonth={() => incrementMonth(setDate2)}
              decrementMonth={() => decrementMonth(setDate2)}
            />
          </div>
        </section>

        <footer className="flex items-start justify-between p-3">
          <div className="flex max-w-[400px] flex-grow flex-wrap gap-1">
            {ranges.map((range) => (
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
