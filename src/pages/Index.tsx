import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ChatBot } from "@/components/ChatBot";
import { CodeEditor } from "@/components/Editor";
import { FileTree } from "@/components/FileTree";
import { defaultValues } from "@/constants/default-values";
import { trainAssistant } from "@/services/api";
import { FileType } from "@/types";
import { Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { encodeContent, decodeContent } from '@/utils/compression';

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<FileType>("flows");
  const [isTraining, setIsTraining] = useState(false);
  const [files, setFiles] = useState({
    flows: decodeContent(searchParams.get("flows")) || defaultValues.flows,
    domain: decodeContent(searchParams.get("domain")) || defaultValues.domain,
    config: decodeContent(searchParams.get("config")) || defaultValues.config,
    endpoints: decodeContent(searchParams.get("endpoints")) || defaultValues.endpoints,
  });

  useEffect(() => {
    const newParams = new URLSearchParams();
    Object.entries(files).forEach(([key, value]) => {
      newParams.set(key, encodeContent(value));
    });
    setSearchParams(newParams);
  }, [files, setSearchParams]);

  const handleFileChange = (content: string) => {
    setFiles((prev) => ({
      ...prev,
      [selectedFile]: content,
    }));
  };

  const handleTrain = async () => {
    setIsTraining(true);
    try {
      await trainAssistant(
        files.flows,
        files.domain,
        files.config,
        files.endpoints
      );
      toast({
        title: "Training Complete",
        description: "The assistant has been successfully trained.",
      });
    } catch (error) {
      toast({
        title: "Training Failed",
        description: "There was an error training the assistant.",
        variant: "destructive",
      });
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-4 py-3 flex justify-between items-center bg-background">
        <h1 className="text-lg font-semibold">Rasa Assistant Editor</h1>
        <Button
          onClick={handleTrain}
          disabled={isTraining}
          className="gap-2"
          size="sm"
        >
          <Play className="w-4 h-4" />
          {isTraining ? "Training..." : "Train Assistant"}
        </Button>
      </header>

      <main className="flex-1 grid grid-cols-[250px_1fr] overflow-hidden">
        <FileTree onFileSelect={setSelectedFile} selectedFile={selectedFile} />
        <div className="h-full">
          <CodeEditor
            value={files[selectedFile]}
            onChange={handleFileChange}
            fileType={selectedFile}
          />
        </div>
      </main>

      <ChatBot />
    </div>
  );
};

export default Index;
