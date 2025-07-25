
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DocumentCard({ doc }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <FileText className="text-indigo-500" />
        <div>
          <h4 className="font-medium">{doc.title}</h4>
          <p className="text-sm text-gray-500">{doc.fileType}</p>
        </div>
      </div>
      <a href={doc.url} download>
        <Button variant="secondary">Download</Button>
      </a>
    </div>
  );
}
