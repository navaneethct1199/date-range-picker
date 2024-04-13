import { useRef, useState, useEffect, useCallback } from "react";
import clsx from "clsx";

const placeholder = "yyyy-MM-dd ~ yyyy-MM-dd";

export type DateRangePickerProps = Readonly<{
  ranges: Array<{
    label: string;
    value: Date[];
  }>;
}>;

export const DateRangePicker = ({ ranges }: DateRangePickerProps) => {
  const element = useRef<HTMLDivElement>(null);

  const [value, setValue] = useState("");
  const [draft, setDraft] = useState(placeholder);
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const focus = () => {
    setIsFocused(true);
    open();
  };
  const blur = useCallback(() => {
    setIsFocused(false);
    close();
  }, []);

  useEffect(() => {
    const handleBlur = (event: MouseEvent) => {
      if (!element.current?.contains(event.target as Node)) blur();
    };

    document.addEventListener("mousedown", handleBlur);
    return () => document.removeEventListener("mousedown", handleBlur);
  }, [blur]);

  const handleInputFocus = () => {
    focus();
    if (!value) setValue(placeholder);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    close();
    setValue(event.target.value);
  };

  const handleInputBlur = () => {
    if (value === placeholder) setValue("");
  };

  const handleRangeSelect = (range: Date[]) => {
    blur();
  };

  const handleSubmit = () => {
    blur();
  };

  return (
    <div
      ref={element}
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
        className={clsx("h-full w-8 flex-shrink-0 outline-none", {
          "cursor-pointer": value && value !== placeholder,
          "cursor-text": !value || value === placeholder,
        })}
      ></button>

      <div
        className={clsx(
          "absolute -left-px top-full mt-px min-w-[36rem] rounded-md bg-zinc-800 shadow",
          { hidden: !isFocused || !isOpen },
        )}
      >
        <header className="px-3 py-2 text-sm">{draft}</header>

        <section className="grid grid-cols-2 border-b border-t border-zinc-700">
          <div className="border-r border-zinc-700 py-3"></div>
          <div className="py-3"></div>
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
