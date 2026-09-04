import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react"; // ✅ MISSING IMPORT
import { useState } from "react";

const EmojiTextarea = () => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const handleEmoji = (emoji: any) => {
    setText((prev) => prev + emoji.native);
    setOpen(false); // ✅ optional UX improvement
  };

  return (
    <div className="relative w-full">
      {/* TEXTAREA */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your meme caption..."
        className="w-full p-3 rounded bg-black text-white"
      />

      {/* EMOJI BUTTON */}
      <button
        type="button" // ✅ prevents form submit issues
        onClick={() => setOpen((prev) => !prev)}
        className="absolute right-2 bottom-2 text-xl"
      >
        😀
      </button>

      {/* PICKER */}
      {open && (
        <div className="absolute bottom-12 right-0 z-50 shadow-lg">
          <Picker
            data={data}
            onEmojiSelect={handleEmoji}
            theme="dark" // ✅ matches your UI
          />
        </div>
      )}
    </div>
  );
};

export default EmojiTextarea;