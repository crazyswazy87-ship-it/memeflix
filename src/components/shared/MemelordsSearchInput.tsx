import { useEffect, useState } from "react";

const memelordPlaceholders = [
  "whats the name of the memelord? 👀",
  "Find your favorite memelord ",
  "Who’s trending today? ",
  "Search by username...",
  "Discover new memelords ",
  "Ni nani anabamba leo? ",
  "Find verified memelords ",
  "Type a username...",
  "Explore top memelords",
  "Who’s making you laugh today? ",
  "Search legends only ",
  "Wozzaa",
];

type MemelordSearchInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function MemelordSearchInput({
  value,
  onChange,
}: MemelordSearchInputProps) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) =>
        prev === memelordPlaceholders.length - 1 ? 0 : prev + 1
      );
    }, 9500);

    return () => clearInterval(interval);
  }, []);

  return (
    <input
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className="memelords-search transition-all duration-500"
      placeholder={
        focused
          ? "Summoning Memelords🔥"
          : memelordPlaceholders[placeholderIndex]
      }
    />
  );
}