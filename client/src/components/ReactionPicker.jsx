// components/ReactionPicker.jsx
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const emojiList = ["👍", "❤️", "😂", "🎉", "😢", "😡"];

export default function ReactionPicker({ onSelect }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="text-lg hover:scale-110 transition">😊</button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-2 flex gap-2">
        {emojiList.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onSelect(emoji)}
            className="text-xl hover:scale-125 transition"
          >
            {emoji}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

