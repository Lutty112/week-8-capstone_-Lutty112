import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EventCard({ event }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-4">
      <div className="flex items-center gap-3">
        <Calendar className="text-purple-500" />
        <div>
          <h3 className="text-lg font-semibold">{event.title}</h3>
          <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
        </div>
      </div>
      <p className="text-gray-600 mt-2">{event.description}</p>
      <Button variant="default" className="mt-3">Join Event</Button>
    </div>
  );
}
