import { ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SuggestionCard({ suggestion, onUpvote }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-gray-800">{suggestion.title}</h4>
          <p className="text-gray-600 text-sm mt-1">{suggestion.content}</p>
        </div>
        <Button size="icon" variant="ghost" onClick={() => onUpvote(suggestion._id)}>
          <ThumbsUp className="h-5 w-5 text-blue-500" />
          <span className="ml-1 text-xs">{suggestion.upvotes}</span>
        </Button>
      </div>
    </div>
  );
}
