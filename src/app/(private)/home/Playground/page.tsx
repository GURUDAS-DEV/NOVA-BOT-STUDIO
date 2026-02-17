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
  value?: string;
};

type ControlledNode = {
  id: string;
  title: string;
  message?: string;
  executor: string;
  output?: {
    mode: "options" | "text";
    optionCount?: number;
    allowGoBack?: boolean;
    allowEnd?: boolean;
    customText?: string;
  };
  inputConfig?: {
    key?: string;
    validationRegex?: string;
    retryLimit?: number;
  };
};

type ControlledResponse =
  | {
      type: "options";
      nodeData: {
        node: ControlledNode;
        options?: ControlledOption[];
        isApiGenerated?: boolean;
      };
      options?: ControlledOption[];
      chatSessionId?: string;
    }
  | {
      type: "input";
      nodeData: {
        node: ControlledNode;
        options?: ControlledOption[];
      };
      options?: ControlledOption[];
      back?: {
        label: string;
        _id: string;
      };
      end?: {
        label: string;
        _id: string;
      };
      chatSessionId?: string;
    }
  | {
      type: "text" | "api";
      message?: string;
      nodeData: {
        node: ControlledNode;
        options?: ControlledOption[];
      };
      options?: ControlledOption[];
      back?: {
        label: string;
        _id: string;
      };
      end?: {
        label: string;
        _id: string;
      };
      chatSessionId?: string;
    };

const getControlledMessage = (response: ControlledResponse) => {
  return (
    (response as { message?: string })?.message ||
    response.nodeData.node.message ||
    ""
  );
};

const getControlledOptions = (response: ControlledResponse) => {
  return response.nodeData.options || response.options || [];
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

  const [showInputForControlled, setShowInputForControlled] = useState<boolean>(false);
  const [doesStarted, setDoesStarted] = useState<boolean>(false);
  const controlledInput = useRef<HTMLInputElement | null>(null);
  const controlledChatSessionId = useRef<string | null>(null);
  const [isControlledLoading, setIsControlledLoading] = useState(false);
  const [isControlledEnded, setIsControlledEnded] = useState(false);
  const [controlledEndMessage, setControlledEndMessage] = useState<string | null>(null);
  const [controlledMessages, setControlledMessages] = useState<Message[]>([]);
  const [controlledResponse, setControlledResponse] =
    useState<ControlledResponse | null>(null);
  const [controlledOptions, setControlledOptions] = useState<ControlledOption[]>([]);

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
    console.log("Rendering text with line breaks:", text);
    return text?.split("\n").map((line, index, array) => (
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
          body: JSON.stringify({ userMessage: inputMessage.trim() }),
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


  ///////////Starting the conversation for controlled flow and getting the first node///////////
  //initial conversation........
  const startConversation = async (): Promise<void> => {
    try {
      setIsControlledLoading(true);
      setIsControlledEnded(false);
      setControlledEndMessage(null);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/websiteBot/ControlledStyleChat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey.current?.value}`,
          },
        },
      );
      const data: ControlledResponse = await response.json();
      if (!response.ok) {
        toast.error("Failed to start conversation: " + (data as { message?: string })?.message);
        return;
      }
      console.log("Start conversation response:", data);

      if (!controlledChatSessionId.current && data.chatSessionId) {
        controlledChatSessionId.current = data.chatSessionId;
      }

      setDoesStarted(true);
      setControlledResponse(data);
      setControlledMessages([
        {
          id: `b-${new Date().getTime()}`,
          role: "bot",
          content: getControlledMessage(data),
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setControlledOptions(getControlledOptions(data));
    } catch (e) {
      toast.error("Error starting conversation: " + (e as Error).message);
    } finally {
      setIsControlledLoading(false);
    }
  };

  const handleNextStep = (response: ControlledResponse) => {
    if (response.chatSessionId && !controlledChatSessionId.current) {
      controlledChatSessionId.current = response.chatSessionId;
    }

    if (response.type === "input") {
      console.log("Handling input type node");
      setShowInputForControlled(true);
    } else if (response.type === "options") {
      console.log("Handling options type node");
      setShowInputForControlled(false);
    } else if (response.type === "text" || response.type === "api") {
      console.log("Handling text/api type node");
      setShowInputForControlled(false);
    } else {
      console.log("Handling unknown type node");
    }

    setControlledOptions(getControlledOptions(response));
    setControlledMessages((prev) => [
      ...prev,
      {
        id: `b-${new Date().getTime()}`,
        role: "bot",
        content: getControlledMessage(response),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const sendControlledRequest = async (body?: Record<string, unknown>) => {
    try {
      setIsControlledLoading(true);
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey.current?.value}`,
      };

      if (controlledChatSessionId.current) {
        headers.chatSessionId = controlledChatSessionId.current;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/websiteBot/ControlledStyleChat`,
        {
          method: "POST",
          headers,
          body: body ? JSON.stringify(body) : undefined,
        },
      );

      const data: ControlledResponse | { message?: string } = await response.json();
      if (!response.ok) {
        toast.error("Failed to get response: " + (data as { message?: string })?.message);
        return;
      }

      if ("type" in data) {
        handleNextStep(data as ControlledResponse);
      } else if ((data as { message?: string })?.message) {
        const endMessage = (data as { message?: string })?.message || "Conversation ended.";
        setIsControlledEnded(true);
        setControlledEndMessage(endMessage);
      }
    } catch (e) {
      toast.error("Error sending request: " + (e as Error).message);
    } finally {
      setIsControlledLoading(false);
    }
  };

  const generalizedFunctionToGetNextNode = async (GivenData: { option?: string; userInput?: string, optionIntent?: string }) => {
    const inputValue = GivenData.option || GivenData.userInput || "";
    if (inputValue.trim().length > 0) {
      setControlledMessages((prev) => [
        ...prev,
        {
          id: `u-${new Date().getTime()}`,
          role: "user",
          content: GivenData.optionIntent || inputValue,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
    await sendControlledRequest({ input: GivenData.option || GivenData.userInput });
  };

  const goBackOrEnd = async (option: ControlledOption) => {
    if (option.optionId === "GO_BACK") {
      setControlledMessages((prev) => [
        ...prev,
        {
          id: `u-${new Date().getTime()}`,
          role: "user",
          content: option.intent || "Go Back",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      await sendControlledRequest({ GO_BACK: true });
      return;
    }
    if (option.optionId === "END_CHAT") {
      setControlledMessages((prev) => [
        ...prev,
        {
          id: `u-${new Date().getTime()}`,
          role: "user",
          content: option.intent || "End Chat",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      await sendControlledRequest({ END_CHAT: true });
    }
  };

  const ActionOnClickOfOptions = async (option: ControlledOption) => {
    if (option.optionId === "GO_BACK" || option.optionId === "END_CHAT") {
      await goBackOrEnd(option);
      return;
    }

    await generalizedFunctionToGetNextNode({ option: option.optionId, optionIntent: option.intent });
  };

  const handleControlledInputSubmit = async()=>{
    console.log("Submitting user input for controlled flow:", controlledInput.current?.value);
    const value = controlledInput.current?.value || "";
    if (controlledInput.current) {
      controlledInput.current.value = "";
    }
    await generalizedFunctionToGetNextNode({ userInput: value });
    setShowInputForControlled(false);
  }

  

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6">
      <Toaster position="top-right" richColors />
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
              {isControlledLoading && (
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

            {isControlledEnded && controlledEndMessage && (
              <div className="rounded-xl border border-border/70 bg-muted/40 p-4 text-center text-sm text-muted-foreground">
                {controlledEndMessage}
              </div>
            )}

            {showInputForControlled && (
              <div className="space-y-3">
                <Input
                  placeholder="Enter your response..."
                  ref={controlledInput}
                  onChange={(event) => {
                    if (controlledInput.current) {
                      controlledInput.current.value = event.target.value;
                    }
                  }}
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
                  disabled={isControlledLoading || isControlledEnded}
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
                    onClick={() => ActionOnClickOfOptions(option)}
                    disabled={isControlledLoading || isControlledEnded}
                  >
                    {option.intent}
                  </Button>
                ))}
              </div>
            )}

            {!doesStarted && (
              <div className="w-full flex justify-center items-center">
                <Button
                  onClick={startConversation}
                  className="w-full md:w-auto cursor-pointer"
                  disabled={isControlledLoading}
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
