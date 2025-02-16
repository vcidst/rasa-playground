import { FileType } from "@/types";
import { File } from "lucide-react";

interface FileTreeProps {
  onFileSelect: (type: FileType) => void;
  selectedFile: FileType;
}

export const FileTree = ({ onFileSelect, selectedFile }: FileTreeProps) => {
  const files: { type: FileType; name: string }[] = [
    { type: "flows", name: "flows" },
    { type: "domain", name: "domain" },
    { type: "config", name: "config" },
    { type: "endpoints", name: "endpoints" },
  ];

  return (
    <div className="p-4 border-r border-border h-full bg-background">
      <h2 className="text-sm font-semibold mb-4">Project Files (YAML)</h2>
      <div className="space-y-2">
        {files.map(({ type, name }) => (
          <button
            key={type}
            onClick={() => onFileSelect(type)}
            className={`flex items-center gap-2 px-2 py-1 w-full text-left rounded transition-colors ${
              selectedFile === type
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent/50"
            }`}
          >
            <File className="w-4 h-4" />
            <span className="text-sm">{name}</span>
          </button>
        ))}
      </div>
      <div className="mt-4 text-sm text-muted-foreground">
        You can share this assistant with the URL.
      </div>
    </div>
  );
};
