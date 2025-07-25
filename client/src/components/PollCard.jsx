import { Button } from "@/components/ui/button";

export default function PollCard({ poll, onVote }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 mb-4">
      <h3 className="text-lg font-semibold text-gray-800">{poll.question}</h3>
      <div className="mt-2 space-y-2">
        {poll.options.map((option, idx) => (
          <Button
            key={idx}
            variant="outline"
            className="w-full justify-between"
            onClick={() => onVote(poll._id, option)}
          >
            <span>{option}</span>
            <span className="text-sm text-gray-500">
              {poll.votes?.[option] || 0} votes
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
