
"use client";

import { useMemo, useRef, useState } from "react";
import {
  Bot,
  FlaskConical,
  KeyRound,
  ListChecks,
  MessageSquare,
  ShieldCheck,
  Sliders,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast, Toaster } from "sonner";

type BotType = "unknown" | "freestyle" | "controlled";
type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  time: string;
};

const PlaygroundPage = () => {
  const apiKey = useRef<HTMLInputElement | null>(null);
  const [botType, setBotType] = useState<BotType>("unknown");
  const [inputMessage, setInputMessage] = useState("");
  const [selectedPath, setSelectedPath] = useState("product-info");
  const [selectedAction, setSelectedAction] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      role: "bot",
      content:
        "Welcome to the playground. Paste an API key to detect the bot style, or switch the preview mode.",
      time: "Now",
    },
  ]);

  const canSend = inputMessage.trim().length > 0;

  const detectBotType = async() : Promise<void> =>{
    try{
      console.log("Detecting bot type for API key:", apiKey.current?.value);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bot/detectBotType`, {
        method : "POST",
        headers : {
          "Content-Type" : "application/json",
        },
        credentials : 'include',
        body : JSON.stringify({ apiKey : apiKey.current?.value })
      });

      const data = await response.json();
      console.log("Bot type detection response:", data);
      if(response.ok){
        setBotType(data.botType);
        toast.success("Successfully Founded the bot : " + data?.botType)
      }
      else{
        toast.error("Failed to detect bot type: " + data?.message);
        setBotType("unknown");
      }
      
    } 
    catch(error){
      console.error("Error detecting bot type:", error);
      toast.error("Error detecting bot type: " + (error as Error).message);
      setBotType("unknown");
    }

  }

  const handleSend = () => {
    if (!canSend) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMessage: Message = {
      id: `u-${now.getTime()}`,
      role: "user",
      content: inputMessage.trim(),
      time,
    };
    const botMessage: Message = {
      id: `b-${now.getTime()}`,
      role: "bot",
      content:
        "This is a placeholder response. Wire your backend to return real answers.",
      time,
    };
    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInputMessage("");
  };

  const modeBadge = useMemo(() => {
    if (botType === "freestyle") {
      return "Freestyle Bot";
    }
    if (botType === "controlled") {
      return "Controlled Bot";
    }
    return "Unknown";
  }, [botType]);

  const controlledOptions = [
    {
      id: "product-info",
      title: "Product info",
      description: "Explore features, pricing, and availability",
    },
    {
      id: "support",
      title: "Support",
      description: "Troubleshoot, FAQs, or report an issue",
    },
    {
      id: "onboarding",
      title: "Onboarding",
      description: "Setup steps and onboarding checklist",
    },
  ];

  const actions = [
    "Show FAQs",
    "Open contact form",
    "Suggest documentation",
    "Start guided flow",
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <FlaskConical className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white font-outfit">
              Playground
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-inter mt-1">
              Test your bot experience internally with a modern, theme-aware UI.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Internal sandbox · No production traffic
        </div>
      </div>

      <Card className="border-border/70 bg-linear-to-br from-white to-slate-50 dark:from-stone-950 dark:to-stone-900">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white font-outfit">
            <KeyRound className="w-5 h-5 text-primary" />
            Connect your API key
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
            Paste the API key to identify the bot type. You can also switch preview mode below.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <Input
              placeholder="Paste API key"
              ref={apiKey}
            />
            <Button onClick={()=>detectBotType()} className="min-w-[180px] cursor-pointer bg-green-600 hover:bg-green-700">
              Detect Bot Type
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-inter">
            <span className="rounded-full border border-border bg-background px-3 py-1 text-muted-foreground">
              Status: {modeBadge}
            </span>
            <span className="rounded-full border border-border bg-background px-3 py-1 text-muted-foreground">
              API key length: 
            </span>
            <span className="rounded-full border border-border bg-background px-3 py-1 text-muted-foreground">
              Preview mode only
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70 dark:bg-black">
        <CardContent className="p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-900  dark:text-white">
              <Sliders className="w-4 h-4 text-primary dark:text-white" />
              Preview Mode
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-inter">
              Switch between Freestyle and Controlled UI while backend wiring is pending.
            </p>
          </div>
          <div className="w-full md:w-[260px]">
            <Select value={botType} onValueChange={(value) => setBotType(value as BotType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select preview" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unknown">Auto (not wired)</SelectItem>
                <SelectItem value="freestyle">Freestyle UI</SelectItem>
                <SelectItem value="controlled">Controlled UI</SelectItem>
              </SelectContent>
            </Select>
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
              Paste an API key and connect the detection logic, or use Preview Mode to explore each UI.
            </p>
          </CardContent>
        </Card>
      )}

      {botType === "freestyle" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-border/70">
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white font-outfit">
                <MessageSquare className="w-5 h-5 text-primary" />
                Freestyle Conversation
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                Ask anything. Responses are placeholder until backend is connected.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-border/70 bg-background p-4 h-[360px] overflow-y-auto space-y-4">
                {messages.map((message) => (
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
                      {message.content}
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {message.time}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <Textarea
                  placeholder="Type your question here..."
                  value={inputMessage}
                  onChange={(event) => setInputMessage(event.target.value)}
                  className="min-h-[120px]"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <Button onClick={handleSend} disabled={!canSend}>
                    Send message
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setMessages(messages.slice(0, 1))}
                  >
                    Reset conversation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-border/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white font-outfit">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Freestyle Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-600 dark:text-gray-400 font-inter">
                <p>
                  This mode lets users ask any question and receive free-form answers from the bot.
                </p>
                <div className="rounded-xl border border-border/70 bg-muted/40 p-4 text-xs">
                  <p className="text-foreground font-medium">Integration checklist</p>
                  <ul className="mt-2 space-y-1 list-disc list-inside">
                    <li>Validate API key ownership</li>
                    <li>Stream messages to the model</li>
                    <li>Store conversation history</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white font-outfit">
                  <ListChecks className="w-4 h-4 text-primary" />
                  Suggested Prompts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  "Summarize our pricing plans",
                  "Explain how onboarding works",
                  "Draft a support reply",
                ].map((prompt) => (
                  <Button
                    key={prompt}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setInputMessage(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {botType === "controlled" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-border/70">
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white font-outfit">
                <ListChecks className="w-5 h-5 text-primary" />
                Controlled Flow
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                Users choose from predefined options. This layout highlights guided actions.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {controlledOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedPath(option.id)}
                    className={`text-left rounded-2xl border p-4 transition-all ${
                      selectedPath === option.id
                        ? "border-primary/70 bg-primary/10"
                        : "border-border/70 hover:border-primary/50"
                    }`}
                  >
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {option.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {option.description}
                    </p>
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Choose next action
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {actions.map((action) => (
                    <Button
                      key={action}
                      variant={selectedAction === action ? "default" : "outline"}
                      onClick={() => setSelectedAction(action)}
                      className="justify-start"
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-muted/40 p-4 text-sm">
                <p className="text-gray-900 dark:text-white font-semibold">
                  Summary
                </p>
                <div className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <p>
                    Selected path: <span className="text-foreground">{selectedPath}</span>
                  </p>
                  <p>
                    Action: <span className="text-foreground">{selectedAction || "None"}</span>
                  </p>
                  <p>
                    Output: Configure backend to return structured responses based on selections.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-border/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white font-outfit">
                  <Sliders className="w-4 h-4 text-primary" />
                  Controlled Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-600 dark:text-gray-400 font-inter">
                <p>
                  This mode limits user input to predefined options, ensuring consistent outputs.
                </p>
                <div className="rounded-xl border border-border/70 bg-muted/40 p-4 text-xs">
                  <p className="text-foreground font-medium">Implementation notes</p>
                  <ul className="mt-2 space-y-1 list-disc list-inside">
                    <li>Validate API key</li>
                    <li>Fetch controlled flow config</li>
                    <li>Return action-specific payloads</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white font-outfit">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Suggested Outputs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-gray-600 dark:text-gray-400 font-inter">
                <div className="rounded-xl border border-border/70 bg-muted/40 p-3">
                  Provide JSON payloads or UI cards based on each option.
                </div>
                <div className="rounded-xl border border-border/70 bg-muted/40 p-3">
                  Disable free text and show contextual help.
                </div> 

              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaygroundPage;
