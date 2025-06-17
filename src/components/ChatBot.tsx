
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Bot, User } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Mock data for context - in a real app, this would come from your API
const mockContext = {
  groups: [
    {
      id: "1",
      name: "Weekend Trip",
      users: ["Alice", "Bob", "Charlie"],
      expenses: [
        { description: "Hotel", amount: 300, paidBy: "Alice", date: "2024-01-20" },
        { description: "Dinner", amount: 120, paidBy: "Bob", date: "2024-01-19" }
      ]
    },
    {
      id: "2", 
      name: "Goa Trip",
      users: ["Alice", "Diana", "Eve"],
      expenses: [
        { description: "Flight", amount: 450, paidBy: "Diana", date: "2024-01-18" },
        { description: "Accommodation", amount: 200, paidBy: "Alice", date: "2024-01-17" }
      ]
    }
  ],
  balances: [
    { groupName: "Weekend Trip", userName: "Alice", amount: 50 },
    { groupName: "Goa Trip", userName: "Alice", amount: -75 },
    { groupName: "Weekend Trip", userName: "Bob", amount: -30 }
  ]
};

const ChatBot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your Splitwise assistant. I can help you find information about your expenses and balances. Try asking me something like 'How much does Alice owe in Goa Trip?' or 'Show me my latest expenses.'",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    if (!apiKey && showApiKeyInput) {
      alert("Please enter your OpenAI API key first");
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are a helpful assistant for a Splitwise expense tracking app. You have access to the following data: ${JSON.stringify(mockContext)}. 
              
              Answer questions about expenses, balances, and group information based on this context. Be concise and friendly. If asked about amounts, always include currency symbols. If you can't find specific information, say so clearly.
              
              Example queries you should handle:
              - "How much does Alice owe in Goa Trip?"
              - "Show me the latest expenses"
              - "Who paid the most in Weekend Trip?"
              - "What's my balance summary?"
              
              Format your responses clearly and include relevant details.`
            },
            {
              role: 'user',
              content: input
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from OpenAI');
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.choices[0].message.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error while processing your request. Please check your API key and try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg">
          <MessageCircle className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <Bot className="h-5 w-5 mr-2" />
            Splitwise Assistant
          </SheetTitle>
        </SheetHeader>

        {showApiKeyInput && (
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">OpenAI API Key Required</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                type="password"
                placeholder="Enter your OpenAI API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => setShowApiKeyInput(false)}
                  disabled={!apiKey}
                >
                  Save Key
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setShowApiKeyInput(false)}
                >
                  Skip for now
                </Button>
              </div>
              <p className="text-xs text-gray-600">
                Your API key is stored locally and not sent to our servers.
              </p>
            </CardContent>
          </Card>
        )}

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex max-w-[80%] ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  } items-start space-x-2`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white ml-2'
                        : 'bg-gray-200 text-gray-600 mr-2'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center mr-2">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex space-x-2 pt-4 border-t">
          <Input
            placeholder="Ask me about your expenses..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatBot;
