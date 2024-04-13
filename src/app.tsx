import { DateRangePicker } from "./components/date-range-picker";

const ranges = [
  {
    label: "Today",
    value: [new Date(), new Date()],
  },
  {
    label: "Yesterday",
    value: [new Date(), new Date()],
  },
  {
    label: "Last 7 Days",
    value: [new Date(), new Date()],
  },
];

export const App = () => (
  <main className="h-full bg-zinc-950 p-8 text-zinc-300">
    <DateRangePicker ranges={ranges} />
  </main>
);
