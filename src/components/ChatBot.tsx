import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { talkToBot } from "@/services/api";
import { MessageSquare, Send, X } from "lucide-react";
import { useState } from "react";

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isBot: boolean }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { text: userMessage, isBot: false }]);
    setIsLoading(true);

    try {
      const { response } = await talkToBot(userMessage);
      setMessages((prev) => [...prev, { text: response, isBot: true }]);
    } catch (error) {
      console.error("Failed to get bot response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      {!isOpen && (
        <Button
          size="icon"
          className="rounded-full w-12 h-12 shadow-lg transition-opacity duration-300"
          style={{ backgroundColor: "blue", color: "white" }}
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      )}

      {isOpen && (
        <div className="w-96 h-[500px] bg-white rounded-lg shadow-lg flex flex-col overflow-hidden transition-all duration-300">
          <div className="flex items-center justify-between p-4 border-b">
            <h5 className="font-semibold">Talk to Assistant</h5>
            <Button size="icon" variant="ghost" onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isBot ? "justify-start" : "justify-end"
                  }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${message.isBot
                      ? "bg-accent text-accent-foreground"
                      : "bg-primary text-primary-foreground"
                    }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-accent text-accent-foreground max-w-[80%] p-3 rounded-lg">
                  Typing...
                </div>
              </div>
            )}
          </div>
          <div className="border-t p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={isLoading}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
