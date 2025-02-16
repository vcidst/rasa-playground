import { FileType } from "@/types";
import Editor from "@monaco-editor/react";
import { useEffect, useRef } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  fileType: FileType;
}

export const CodeEditor = ({ value, onChange, fileType }: CodeEditorProps) => {
  const editorRef = useRef(null);

  useEffect(() => {
    // Force editor to refresh when fileType changes
    if (editorRef.current) {
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 0);
    }
  }, [fileType]);

  return (
    <div className="h-full w-full overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage="yaml"
        value={value}
        onChange={(value) => onChange(value || "")}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "JetBrains Mono",
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16 },
        }}
        onMount={(editor) => {
          editorRef.current = editor;
        }}
      />
    </div>
  );
};
