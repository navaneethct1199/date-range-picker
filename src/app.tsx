import { DateRangePicker } from "./components/date-range-picker";

const ranges = [
  {
    label: "Last Friday",
    value: [new Date(2024, 3, 12), new Date(2024, 3, 12)],
  },
  {
    label: "Last Monday",
    value: [new Date(2024, 3, 8), new Date(2024, 3, 8)],
  },
  {
    label: "Last Week",
    value: [new Date(2024, 3, 8), new Date(2024, 3, 12)],
  },
];

export const App = () => (
  <main className="h-full bg-zinc-950 p-8 text-zinc-300">
    <DateRangePicker ranges={ranges} />
  </main>
);
