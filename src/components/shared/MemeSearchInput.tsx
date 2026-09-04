import { useEffect, useState } from "react";

const memePlaceholders = [
  "Try Searching 4 memes... ",
  "^_^",
  "^_~",
  "Search anything,,,",
  "Whats trending today..",
  "Ni mwecheche 🔥  ",
  "*_*",
  "Are you still bored 👀,,,",
  "Whats trending today??",
  ">_<",
  "Try out our Ai Assistant 👉",
  "-_-",
  "^_-",
  "Start typing..",
  "Trending slang",
];

type MemeSearchInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function MemeSearchInput({ value, onChange }: MemeSearchInputProps) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) =>
        prev === memePlaceholders.length - 1 ? 0 : prev + 1
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
      className="explore-search transition-all duration-500"
      placeholder={
        focused ? "Summoning Kanairo's humor 😂︎"  : memePlaceholders[placeholderIndex]
      }
    />
  );
}