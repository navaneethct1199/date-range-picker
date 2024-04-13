import { useState } from "react";

const placeholder = "yyyy-MM-dd ~ yyyy-MM-dd";

export function DateRangePicker() {
  const [value, setValue] = useState("");

  function handleFocus() {
    if (!value) setValue(placeholder);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value);
  }

  function handleBlur() {
    if (value === placeholder) setValue("");
  }

  return (
    <div>
      <input
        placeholder={placeholder}
        value={value}
        onFocus={handleFocus}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </div>
  );
}
