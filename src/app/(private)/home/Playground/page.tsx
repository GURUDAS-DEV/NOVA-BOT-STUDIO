"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, KeyRound, MessageSquare, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast, Toaster } from "sonner";

type BotType = "unknown" | "freestyle" | "controlled";
type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  time: string;
};

type ControlledOption = {
  optionId: string;
  intent: string;
  order?: number;
};

type ControlledResponse =
  | {
      type: "options";
      nodeData: {
        node: {
          id: string;
          title: string;
          message: string;
          executor: string;
          output: {
            mode: "options";
            optionCount: number;
            allowGoBack: boolean;
            allowEnd: boolean;
          };
        };
        options: ControlledOption[];
        isApiGenerated: boolean;
      };
    }
  | {
      type: "input";
      nodeData: {
        id: string;
        title: string;
        message: string;
        executor: string;
        output: {
          mode: "text";
          optionCount: number;
          allowGoBack: boolean;
          allowEnd: boolean;
        };
        inputConfig: {
          retryLimit: number;
        };
      };
      options: ControlledOption[];
    }
  | {
      type: "text";
      nodeData: string;
      options: ControlledOption[];
      back?: {
        label: string;
        _id: string;
      };
      end?: {
        label: string;
        _id: string;
      };
    };

const PlaygroundPage = () => {
  const apiKey = useRef<HTMLInputElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const controlledContainerRef = useRef<HTMLDivElement | null>(null);
  const [botType, setBotType] = useState<BotType>("unknown");
  const [inputMessage, setInputMessage] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      role: "bot",
      content:
        "Welcome to the playground. You can test you bot working here before intergrating it to you service.",
      time: "Now",
    },
  ]);
  const [doesStarted, setDoesStarted] = useState<boolean>(false);
  const [controlledInput, setControlledInput] = useState("");
  const [controlledMessages, setControlledMessages] = useState<Message[]>([]);
  const [controlledResponse, setControlledResponse] =
    useState<ControlledResponse | null>(null);

  const canSend = inputMessage.trim().length > 0;

  useEffect(() => {
    if (botType !== "freestyle") return;
    const container = chatContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [messages, botType]);

  useEffect(() => {
    if (botType !== "controlled") return;
    const container = controlledContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [controlledMessages, botType]);

  const renderWithLineBreaks = (text: string, keyPrefix: string) => {
    return text.split("\n").map((line, index, array) => (
      <span key={`${keyPrefix}-${index}`}>
        {line}
        {index < array.length - 1 && <br />}
      </span>
    ));
  };

  const formatBotMessage = (content: string) => {
    const parts = content.split("**");
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <strong key={`bold-${index}`}>
            {renderWithLineBreaks(part, `bold-${index}`)}
          </strong>
        );
      }
      return (
        <span key={`text-${index}`}>
          {renderWithLineBreaks(part, `text-${index}`)}
        </span>
      );
    });
  };

  const detectBotType = async (): Promise<void> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bot/detectBotType`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ apiKey: apiKey.current?.value }),
        },
      );

      const data = await response.json();
      if (response.ok) {
        setBotType(data.botType);
        toast.success("Bot detected: " + data?.botType);
      } else {
        toast.error("Failed to detect bot type: " + data?.message);
        setBotType("unknown");
      }
    } catch (error) {
      toast.error("Error detecting bot type: " + (error as Error).message);
      setBotType("unknown");
    }
  };

  const handleFreeStyleChat = async () => {
    if (!canSend) {
      toast.error("Please enter a message to send.");
      return;
    }
    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const userMessage: Message = {
      id: `u-${now.getTime()}`,
      role: "user",
      content: inputMessage.trim(),
      time,
    };
    setInputMessage("");
    setMessages((prev) => [...prev, userMessage]);

    setIsBotTyping(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/websiteBot/FreeStyleChat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey.current?.value}`,
          },
          body: JSON.stringify({ input: inputMessage.trim() }),
        },
      );

      const data = await response.json();
      console.log("API response:", data);

      if (response.ok) {
        const botRepy = data.message;
        const botMessage: Message = {
          id: `b-${now.getTime()}`,
          role: "bot",
          content: botRepy,
          time,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        toast.error("Failed to get response: " + data?.message);
        const botMessage: Message = {
          id: `b-${now.getTime()}`,
          role: "bot",
          content: "Failed to get response: " + data?.message,
          time,
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      const botMessage: Message = {
        id: `b-${now.getTime()}`,
        role: "bot",
        content: "Error getting response: " + (error as Error).message,
        time,
      };
      setMessages((prev) => [...prev, botMessage]);
      toast.error("Error getting response : " + (error as Error).message);
    } finally {
      setIsBotTyping(false);
    }
  };

  const appendControlledMessage = (role: "user" | "bot", content: string) => {
    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const newMessage: Message = {
      id: `${role}-${now.getTime()}`,
      role,
      content,
      time,
    };
    setControlledMessages((prev) => [...prev, newMessage]);
  };

  const getBotMessageFromResponse = (response: ControlledResponse) => {
    if (response.type === "options") {
      return response.nodeData.node.message;
    }
    if (response.type === "input") {
      return response.nodeData.message;
    }
    return response.nodeData;
  };

  const handleControlledApiResponse = (response: ControlledResponse) => {
    setControlledResponse(response);
    const botMessage = getBotMessageFromResponse(response);
    if (botMessage) {
      appendControlledMessage("bot", botMessage);
    }
  };

  const fetchControlledResponse = async (payload?: { input?: string }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/websiteBot/ControlledStyleChat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey.current?.value}`,
          },
          body: payload ? JSON.stringify(payload) : undefined,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error("Failed to get response: " + (data?.message || response.statusText));
        return null;
      }

      return data as ControlledResponse;
    } catch (e) {
      toast.error("Error getting response: " + (e as Error).message);
      return null;
    }
  };

  const handleStartControlled = async () => {
    setDoesStarted(true);
    setControlledInput("");
    setControlledMessages([]);
    setControlledResponse(null);

    const response = await fetchControlledResponse();
    if (response) {
      handleControlledApiResponse(response);
    }
  };

   function getCookie(name : string): string | undefined {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith(name + "="))
    ?.split("=")[1];
}

  const handleControlledOption = async (option: ControlledOption) => {
    try{
     
    const chatSessionId = getCookie("chatSessionId");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/websiteBot/ControlledStyleChat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization : `Bearer ${apiKey.current?.value}`,
          "SessionId" : chatSessionId || "",
        },
        body: JSON.stringify({ input: option.optionId }),
      });

      const data = await response.json();
      console.log("Controlled option API response:", data);
    }
    catch(e){
      toast.error("Error handling option: " + (e as Error).message);
    }
  };

  const handleControlledInputSubmit = async () => {
    const trimmed = controlledInput.trim();
    if (!trimmed) {
      toast.error("Please enter a value.");
      return;
    }

    appendControlledMessage("user", trimmed);
    setControlledInput("");

    const response = await fetchControlledResponse({ input: trimmed });
    if (response) {
      handleControlledApiResponse(response);
    }
  };

  const controlledOptions = (() => {
    if (!controlledResponse) return [];
    if (controlledResponse.type === "options") {
      return controlledResponse.nodeData.options;
    }
    return controlledResponse.options;
  })();

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6">
      <Toaster position="top-right" richColors/>
      <Card className="border-border/70 bg-linear-to-br from-white to-slate-50 dark:from-stone-950 dark:to-stone-900">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white font-outfit">
            <KeyRound className="w-5 h-5 text-primary" />
            Enter API key
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
            Add your API key to detect the bot style. UI will appear after
            detection.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <Input placeholder="Paste API key" ref={apiKey} />
            <Button
              onClick={detectBotType}
              className="min-w-[180px] cursor-pointer bg-green-600 hover:bg-green-700"
            >
              Detect Bot Type
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-inter">
            <span className="rounded-full border border-border bg-background px-3 py-1 text-muted-foreground">
              Status: {botType}
            </span>
          </div>
        </CardContent>
      </Card>

      {botType === "unknown" && (
        <Card className="border-dashed border-border/80 bg-muted/30">
          <CardContent className="p-8 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-outfit">
              Waiting for bot type
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
              Paste an API key and run detection to load the correct UI.
            </p>
          </CardContent>
        </Card>
      )}

      {botType === "freestyle" && (
        <Card className="border-border/70 dark:bg-black">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white font-outfit">
              <MessageSquare className="w-5 h-5 text-primary dark:text-white" />
              Freestyle Chat
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
              Simple chat UI with input and send button.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 dark:bg-black">
            <div
              ref={chatContainerRef}
              className="rounded-2xl border border-border/70 bg-background p-4 h-[360px] overflow-y-auto space-y-4 dark:bg-black"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex flex-col gap-1 ${
                    message.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm font-inter shadow-sm b ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {message.role === "bot"
                      ? formatBotMessage(message.content)
                      : message.content}
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {message.time}
                  </span>
                </div>
              ))}
              {isBotTyping && (
                <div className="flex items-start">
                  <div className="bg-muted text-foreground rounded-2xl px-4 py-2 text-sm font-inter shadow-sm">
                    <span className="inline-flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:-0.2s]" />
                      <span className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:-0.1s]" />
                      <span className="h-2 w-2 rounded-full bg-current animate-bounce" />
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-3 dark:bg-black">
              <Input
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(event) => setInputMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleFreeStyleChat();
                  }
                }}
                className="dark:bg-black dark:text-white"
              />
              <div className="flex items-center gap-2">
                <Button
                  className="bg-dark text-white cursor-pointer dark:bg-white dark:text-black"
                  onClick={handleFreeStyleChat}
                  disabled={!canSend}
                >
                  Send
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setMessages(messages.slice(0, 1))}
                >
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {botType === "controlled" && (
        <Card className="border-border/70 bg-black">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white font-outfit">
              <Play className="w-5 h-5 text-primary" />
              Controlled Flow
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
              Guided flow with options or input, based on the node type.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              ref={controlledContainerRef}
              className="rounded-2xl dark:bg-black border border-border/70 bg-background p-4 h-[280px] overflow-y-auto space-y-4"
            >
              {!doesStarted && (
                <div className="text-sm text-gray-600 dark:text-gray-400 font-inter text-center">
                  Click start to load the first controlled node.
                </div>
              )}
              {controlledMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex flex-col gap-1 ${
                    message.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm font-inter shadow-sm ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {renderWithLineBreaks(message.content, message.id)}
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {message.time}
                  </span>
                </div>
              ))}
            </div>

            {doesStarted && controlledResponse?.type === "input" && (
              <div className="space-y-3">
                <Input
                  placeholder="Enter your response..."
                  value={controlledInput}
                  onChange={(event) => setControlledInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleControlledInputSubmit();
                    }
                  }}
                  className="dark:bg-black dark:text-white"
                />
                <Button
                  onClick={handleControlledInputSubmit}
                  className="w-full md:w-auto"
                >
                  Submit Input
                </Button>
              </div>
            )}

            {doesStarted && controlledOptions.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {controlledOptions.map((option) => (
                  <Button
                    key={option.optionId}
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleControlledOption(option)}
                  >
                    {option.intent}
                  </Button>
                ))}
              </div>
            )}

            {!doesStarted && (
              <div className="w-full flex justify-center items-center">
                <Button
                  onClick={handleStartControlled}
                  className="w-full md:w-auto cursor-pointer"
                >
                  Start Conversation
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlaygroundPage;
