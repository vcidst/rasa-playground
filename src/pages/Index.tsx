
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ChatBot } from "@/components/ChatBot";
import { CodeEditor } from "@/components/Editor";
import { FileTree } from "@/components/FileTree";
import { defaultValues } from "@/constants/default-values";
import { trainAssistant } from "@/services/api";
import { FileType } from "@/types";
import { Play, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<FileType>("flows");
  const [isTraining, setIsTraining] = useState(false);
  const [apiUrl, setApiUrl] = useState(searchParams.get("apiUrl") || defaultValues.apiUrl);
  const [files, setFiles] = useState({
    flows: searchParams.get("flows") || defaultValues.flows,
    domain: searchParams.get("domain") || defaultValues.domain,
    config: searchParams.get("config") || defaultValues.config,
    endpoints: searchParams.get("endpoints") || defaultValues.endpoints,
  });

  useEffect(() => {
    const newParams = new URLSearchParams();
    Object.entries(files).forEach(([key, value]) => {
      newParams.set(key, value);
    });
    newParams.set("apiUrl", apiUrl);
    setSearchParams(newParams);
  }, [files, apiUrl, setSearchParams]);

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
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">API Settings</h4>
                <p className="text-sm text-muted-foreground">
                  Configure the model service URL.
                </p>
                <Input
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="Enter API URL"
                  className="h-8"
                />
              </div>
            </PopoverContent>
          </Popover>
          <Button
            onClick={handleTrain}
            disabled={isTraining}
            className="gap-2"
            size="sm"
          >
            <Play className="w-4 h-4" />
            {isTraining ? "Training..." : "Train Assistant"}
          </Button>
        </div>
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
