import { formatCount, type formatCountRepost } from "@/lib/utils";
import { motion } from "framer-motion";

type EmojiBarProps = {
  emoji: React.ReactNode;
  value: string;
  count: number;
  total: number;
  onClick: (value: string) => void;
};

const EmojiBar = ({
  emoji,
  value,
  count,
  total,
  onClick,
}: EmojiBarProps) => {
  const percentage = total ? (count / total) * 100 : 0;

  // ✅ FIX: define filledBlocks
  const totalBlocks = 12;
  const filledBlocks = Math.round((percentage / 100) * totalBlocks);
  const blocks = "███".repeat(filledBlocks).padEnd(totalBlocks, "░");

  return (
    <div
      onClick={() => onClick(value)}
      className="flex items-center gap-2 cursor-pointer group"
    >
      {/* Emoji */}
      <div className="text-lg">{emoji}</div>

      {/* Bar container */}
      <div className="flex-1 flex flex-col">
        
        {/* Animated bar */}
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.4 }}
            className="h-full bg-primary"
          />
        </div>

        {/* Text bar */}
        <span className="text-[10px] font-mono text-muted-foreground">
          {blocks}
        </span>
      </div>

      {/* Count */}
      <span className="text-xs text-muted-foreground w-8 text-right">
        {formatCount(count)}
      </span>
    </div>
  );
};

export default EmojiBar;