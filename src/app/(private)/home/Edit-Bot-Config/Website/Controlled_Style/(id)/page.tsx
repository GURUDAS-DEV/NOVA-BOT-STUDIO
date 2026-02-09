"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Plus, Trash2, ChevronRight, ArrowLeft, RefreshCw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";

interface BotOption {
  id: string;
  label: string;
  nextNodeId: string;
  actionType?: "normal" | "back" | "end";
}

type ApiExecutorConfig = {
  endpoint: string;
  method: "GET";
  params?: { key: string; value: string }[];
};

type InputExecutorConfig = {
  key: string;
  type: "text" | "number";
  validation?: string;
  retryLimit?: number;
};

type Executor =
  | { type: "api"; config: ApiExecutorConfig }
  | { type: "input"; config: InputExecutorConfig };

interface BotNode {
  id: string;
  title: string;
  message: string;
  input?: {
    key: string;
    type: "text" | "number";
    validation?: string;
    retryLimit?: number;
  };
  executor?: Executor;
  inputNextNodeId?: string;
  output: {
    type: "text" | "options" | "end";
    customText?: string;
    controls?: {
      allowBack?: boolean;
      allowEnd?: boolean;
    };
  };
  optionsSource?: "static" | "dynamic";
  apiResponseMapping?: {
    dataField: string;
    labelField: string;
    valueField: string;
    nextNodeId: string;
  };
  options: BotOption[];
}

interface Bot {
  id: string;
  name: string;
  nodes: BotNode[];
}

type BackendOption = {
  id?: string;
  optionId?: string;
  label?: string;
  intent?: string;
  nextNodeId?: string;
  next?: string;
  actionType?: "normal" | "back" | "end";
};

type BackendNode = {
  _id?: string;
  id?: string;
  title?: string;
  message?: string;
  executor?: string;
  input?: BotNode["input"];
  inputNextNodeId?: string;
  output?: BotNode["output"];
  optionsSource?: BotNode["optionsSource"];
  apiResponseMapping?: BotNode["apiResponseMapping"];
  apiConfig?: {
    endpoint?: string;
    method?: "GET";
    params?: { key: string; value: string }[];
    inputConfig?: InputExecutorConfig;
  };
  options?: BackendOption[];
};

type BackendBot = {
  _id?: string;
  id?: string;
  name?: string;
  node?: BackendNode[];
  nodes?: BackendNode[];
};

const createEmptyBot = (botId: string): Bot => ({
  id: botId,
  name: "Controlled Bot",
  nodes: [
    {
      id: "node-1",
      title: "Welcome",
      message: "Hi! How can I help you today?",
      output: { type: "options", controls: { allowBack: false, allowEnd: true } },
      options: [],
    },
  ],
});

const normalizeBackendBot = (raw: BackendBot): Bot => {
  const backendNodes = raw.nodes || raw.node || [];
  const idMap = new Map<string, string>();

  backendNodes.forEach((node, index) => {
    const backendId = (node.id || node._id || `node-${index + 1}`).toString();
    idMap.set(backendId, backendId);
  });

  const nodes: BotNode[] = backendNodes.map((node, index) => {
    const nodeId = (node.id || node._id || `node-${index + 1}`).toString();
    const executorType = node.executor || "none";
    const inputConfig = node.apiConfig?.inputConfig || node.input;
    const executor: Executor | undefined =
      executorType === "api"
        ? {
            type: "api",
            config: {
              endpoint: node.apiConfig?.endpoint || "",
              method: node.apiConfig?.method || "GET",
              params: node.apiConfig?.params || [],
            },
          }
        : executorType === "input"
          ? {
              type: "input",
              config: {
                key: inputConfig?.key || "",
                type: inputConfig?.type || "text",
                validation: inputConfig?.validation,
                retryLimit: inputConfig?.retryLimit,
              },
            }
          : undefined;

    const options: BotOption[] = (node.options || []).map((option, optionIndex) => {
      const optionId = (option.id || option.optionId || `opt-${nodeId}-${optionIndex}`).toString();
      return {
        id: optionId,
        label: option.label || option.intent || "Option",
        nextNodeId: option.nextNodeId || option.next || "",
        actionType: option.actionType,
      };
    });

    return {
      id: nodeId,
      title: node.title || "Untitled",
      message: node.message || "",
      input: node.input,
      executor,
      inputNextNodeId: node.inputNextNodeId,
      output: node.output || { type: "options" },
      optionsSource: node.optionsSource,
      apiResponseMapping: node.apiResponseMapping,
      options,
    };
  });

  return {
    id: raw.id || raw._id?.toString() || "",
    name: raw.name || "Controlled Bot",
    nodes: nodes.length > 0 ? nodes : createEmptyBot("").nodes,
  };
};

export default function EditControlledBotConfig() {
  const pathname = usePathname()
  const searchParams = useSearchParams();
  const [botIdFromParams, setBotIdFromParams] = useState(searchParams.get("id") || "");
  const [botIdInput, setBotIdInput] = useState(botIdFromParams);
  const [bot, setBot] = useState<Bot>(createEmptyBot(botIdFromParams));
  const [selectedNodeId, setSelectedNodeId] = useState<string>("node-1");
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [botNotFound, setBotNotFound] = useState(false);
  
  const selectedNode = bot.nodes.find((n) => n.id === selectedNodeId);
  const selectedOption = selectedNode?.options.find((o) => o.id === selectedOptionId);

  const updateNode = <K extends keyof BotNode>(nodeId: string, field: K, value: BotNode[K]) => {
    setBot((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => (n.id === nodeId ? { ...n, [field]: value } : n)),
    }));
  };

  const updateNodeNested = (
    nodeId: string,
    path: "input" | "executor" | "output",
    value: BotNode["input" | "executor" | "output"],
  ) => {
    setBot((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => (n.id === nodeId ? { ...n, [path]: value } : n)),
    }));
  };

  const updateOption = <K extends keyof BotOption>(
    nodeId: string,
    optionId: string,
    field: K,
    value: BotOption[K],
  ) => {
    setBot((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              options: n.options.map((o) => (o.id === optionId ? { ...o, [field]: value } : o)),
            }
          : n,
      ),
    }));
  };

  const addNode = () => {
    const newNodeId = `node-${Date.now()}`;
    const newNode: BotNode = {
      id: newNodeId,
      title: "New Node",
      message: "Enter message here...",
      output: { type: "options" },
      optionsSource: "static",
      options: [],
    };
    setBot((prev) => ({ ...prev, nodes: [...prev.nodes, newNode] }));
    setSelectedNodeId(newNodeId);
    setSelectedOptionId(null);
  };

  const deleteNode = (nodeId: string) => {
    if (bot.nodes.length === 1) {
      toast.warning("At least one node is required");
      return;
    }
    const filtered = bot.nodes.filter((n) => n.id !== nodeId);
    setBot((prev) => ({ ...prev, nodes: filtered }));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(filtered[0].id);
      setSelectedOptionId(null);
    }
  };

  const addOption = (nodeId: string) => {
    if (selectedNode && selectedNode.options.length >= 5) {
      toast.warning("Maximum 5 options allowed per node");
      return;
    }
    const newOptionId = `opt-${Date.now()}`;
    const newOption: BotOption = { id: newOptionId, label: "New Option", nextNodeId: "", actionType: "normal" };
    updateNode(nodeId, "options", [...(selectedNode?.options || []), newOption]);
  };

  const deleteOption = (nodeId: string, optionId: string) => {
    const node = bot.nodes.find((n) => n.id === nodeId);
    if (!node) return;
    updateNode(nodeId, "options", node.options.filter((o) => o.id !== optionId));
  };

  const setExecutorType = (nodeId: string, type: "none" | "api" | "input") => {
    if (type === "none") {
      updateNodeNested(nodeId, "executor", undefined);
    } else if (type === "api") {
      updateNodeNested(nodeId, "executor", { type: "api", config: { endpoint: "", method: "GET" } });
    } else {
      updateNodeNested(nodeId, "executor", { type: "input", config: { key: "", type: "text" } });
    }
  };

  const currentExecutorType: "none" | "api" | "input" = selectedNode?.executor?.type
    ? (selectedNode.executor.type as "api" | "input")
    : "none";

  const loadBot = async (botId: string) => {
    if (!botId) {
      setBotNotFound(true);
      toast.error("Bot ID is missing");
      return;
    }

    setIsLoading(true);
    setBotNotFound(false);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/botConfig/getControlledBotConfig/${botId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      const data = await response.json();
      console.log("Raw bot data from server:", data);
      if (!response.ok) {
        if (response.status === 404) {
          setBotNotFound(true);
          toast.error(data?.message || "Bot not found");
        } else {
          toast.error(data?.message || "Failed to load bot");
        }
        return;
      }

      setBotNotFound(false);

      const backendBot: BackendBot | null =
        data?.data || data?.constructedBot || data?.bot || data?.data?.bot || data?.config || null;
      if (!backendBot || !((backendBot.nodes || backendBot.node) && (backendBot.nodes || backendBot.node)?.length)) {
        setBotNotFound(true);
        toast.error("Bot data is missing or invalid");
        return;
      }

      const normalizedBot = normalizeBackendBot(backendBot);
      setBot(normalizedBot);
      setSelectedNodeId(normalizedBot.nodes[0]?.id || "");
      setSelectedOptionId(null);
      toast.success("Bot loaded");
    } catch (e) {
      toast.error("Error loading bot: " + (e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const saveBot = async () => {
    if (!botIdInput && !bot.id) {
      toast.error("Bot ID is required to save");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bot/setupWebsiteControlledStyleBotConfig`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bot: { ...bot, id: botIdInput || bot.id }, botId: botIdInput || bot.id }),
          credentials: "include",
        },
      );

      const data = await response.json();
      if (!response.ok) {
        toast.error(data?.message || "Failed to save bot");
        return;
      }

      toast.success(data?.message || "Bot saved successfully");
    } catch (e) {
      toast.error("Error saving bot: " + (e as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    console.log("Bot ID from URL params:", botIdFromParams);
      loadBot(botIdFromParams);
  }, [botIdFromParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-white font-inter flex items-center justify-center px-6">
        <div className="w-full max-w-2xl rounded-2xl border border-stone-200 dark:border-stone-800 bg-white/90 dark:bg-stone-900/70 backdrop-blur p-8 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
              <RefreshCw className="h-6 w-6 text-pink-600 dark:text-pink-400 animate-spin" />
            </div>
            <div>
              <h2 className="text-lg font-outfit font-bold">Loading bot configuration</h2>
              <p className="text-sm text-stone-600 dark:text-stone-300">Please wait while we fetch the bot details.</p>
            </div>
          </div>
          <div className="mt-5 h-2 w-full rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
            <div className="h-full w-2/3 bg-linear-to-r from-pink-500 to-purple-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (botNotFound) {
    return (
      <div className="min-h-screen w-full bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-white font-inter flex items-center justify-center px-6">
        <div className="w-full max-w-2xl rounded-2xl border border-stone-200 dark:border-stone-800 bg-white/90 dark:bg-stone-900/70 backdrop-blur p-8 shadow-xl">
          <h2 className="text-xl font-outfit font-bold">Bot not found</h2>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
            The bot ID in the URL is invalid or no longer exists. Please check the link and try again.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => loadBot(botIdInput)}
              className="bg-linear-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white"
            >
              Retry
            </Button>
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              Go back
            </Button>
          </div>
          <p className="mt-4 text-xs text-stone-500 dark:text-stone-400">Bot ID: {botIdInput || "Not provided"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-white font-inter">
      <Toaster richColors position="top-right" />

      <div className="flex-1 border-b lg:border-b-0 lg:border-r border-stone-700 p-6 overflow-y-auto">
        <div className="mb-6 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-outfit font-bold">Edit Controlled Bot</h2>
              <p className="text-sm text-stone-400">Load a bot, edit nodes and options, then save changes.</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => loadBot(botIdInput)}
                className="bg-stone-800 hover:bg-stone-700"
                disabled={isLoading}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {isLoading ? "Loading..." : "Load Bot"}
              </Button>
              <Button
                onClick={saveBot}
                className="bg-linear-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                disabled={isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={botIdInput}
              onChange={(e) => setBotIdInput(e.target.value)}
              placeholder="Enter Bot ID"
              className="w-full sm:w-96 bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white"
            />
            <div className="text-xs text-stone-400 flex items-center">
              Use the bot ID from the URL or dashboard to load existing config.
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-outfit font-bold">Node Flow</h2>
            <p className="text-sm text-stone-400">Select a node or option to edit details.</p>
          </div>
          <Button onClick={addNode} className="bg-pink-600 hover:bg-pink-700" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Node
          </Button>
        </div>

        <div className="max-w-2xl space-y-6">
          {bot.nodes.map((node, nodeIdx) => (
            <div key={node.id} className="space-y-3">
              <div
                onClick={() => {
                  setSelectedNodeId(node.id);
                  setSelectedOptionId(null);
                }}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedNodeId === node.id && !selectedOptionId
                    ? "bg-pink-600/20 border-pink-600"
                    : "bg-stone-800 border-stone-700 hover:border-stone-600"
                }`}
              >
                <div className="font-semibold text-pink-400 text-sm">{node.title}</div>
                <div className="text-sm text-stone-300 mt-1">{node.message}</div>
              </div>

              {node.options.length > 0 && (
                <div className="ml-4 space-y-2">
                  {node.options.map((option) => {
                    const nextNode = option.nextNodeId
                      ? bot.nodes.find((n) => n.id === option.nextNodeId)
                      : null;
                    const isSelected = selectedOptionId === option.id && selectedNodeId === node.id;

                    return (
                      <div key={option.id} className="space-y-2">
                        <button
                          onClick={() => {
                            setSelectedNodeId(node.id);
                            setSelectedOptionId(option.id);
                          }}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            isSelected
                              ? "bg-stone-700 border-pink-600"
                              : "bg-stone-800 border-stone-700 hover:border-stone-600"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <ChevronRight className="w-4 h-4 text-stone-500" />
                            <div>
                              <div className="font-medium text-sm text-white">{option.label}</div>
                            </div>
                          </div>
                        </button>

                        {nextNode && (
                          <div className="ml-6 text-xs text-stone-500 flex items-center gap-1">
                            <ChevronRight className="w-3 h-3" />
                            Links to: <span className="text-pink-400">{nextNode.title}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {nodeIdx < bot.nodes.length - 1 && (
                <div className="flex justify-center py-2">
                  <div className="text-stone-600">↓</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-96 border-t lg:border-t-0 border-stone-700 p-6 overflow-y-auto flex flex-col">
        {selectedOption ? (
          <div>
            <div className="mb-6 pb-4 border-b border-stone-700">
              <button
                onClick={() => setSelectedOptionId(null)}
                className="flex items-center gap-2 text-sm text-stone-400 hover:text-white transition-colors mb-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to {selectedNode?.title}
              </button>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-stone-400">{selectedNode?.title}</span>
                <ChevronRight className="w-4 h-4 text-stone-600" />
                <span className="text-pink-400 font-medium">{selectedOption.label}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Option Label</label>
              <input
                type="text"
                value={selectedOption.label}
                onChange={(e) => updateOption(selectedNodeId, selectedOptionId!, "label", e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white placeholder-stone-500"
              />
            </div>

            {(!selectedOption.actionType || selectedOption.actionType === "normal") && (
              <div className="mb-6 p-4 bg-stone-800/50 rounded-lg border border-stone-700">
                <label className="block text-sm font-medium mb-3">Link to Node</label>
                <select
                  value={selectedOption.nextNodeId || ""}
                  onChange={(e) => updateOption(selectedNodeId, selectedOptionId!, "nextNodeId", e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="">-- Select a node --</option>
                  {bot.nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Button
              onClick={() => {
                deleteOption(selectedNodeId, selectedOptionId!);
                setSelectedOptionId(null);
              }}
              variant="ghost"
              className="w-full text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Option
            </Button>
          </div>
        ) : selectedNode ? (
          <div>
            <div className="mb-6 pb-4 border-b border-stone-700">
              <h3 className="text-sm font-medium text-stone-400">Editing Node</h3>
              <h2 className="text-lg font-outfit font-bold text-pink-400 mt-1">{selectedNode.title}</h2>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Node Title</label>
              <input
                type="text"
                value={selectedNode.title}
                onChange={(e) => updateNode(selectedNodeId, "title", e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white placeholder-stone-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                value={selectedNode.message}
                onChange={(e) => updateNode(selectedNodeId, "message", e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white placeholder-stone-500 h-24 resize-none"
              />
            </div>

            <div className="mb-6 p-4 bg-stone-800/50 rounded-lg border border-stone-700 space-y-3">
              <label className="block text-sm font-medium">Executor</label>
              <div className="grid grid-cols-3 gap-2">
                {(["none", "api", "input"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setExecutorType(selectedNodeId, t)}
                    className={`p-2 rounded-lg border text-left text-xs capitalize ${
                      currentExecutorType === t
                        ? "bg-pink-600/20 border-pink-600"
                        : "bg-stone-800 border-stone-700 hover:border-pink-600/50"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {currentExecutorType === "api" && (
                <div className="grid grid-cols-1 gap-3 mt-3">
                  {(() => {
                    const apiConfig =
                      selectedNode.executor?.type === "api"
                        ? (selectedNode.executor.config as ApiExecutorConfig)
                        : undefined;
                    return (
                      <>
                        <div>
                          <label className="block text-xs font-medium mb-1">Endpoint</label>
                          <input
                            type="text"
                            value={apiConfig?.endpoint || ""}
                            onChange={(e) =>
                              updateNodeNested(selectedNodeId, "executor", {
                                type: "api",
                                config: {
                                  ...(apiConfig || { endpoint: "", method: "GET" }),
                                  endpoint: e.target.value,
                                  method: apiConfig?.method || "GET",
                                },
                              })
                            }
                            className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm"
                            placeholder="https://api.example.com/endpoint"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Method</label>
                          <div className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-300">
                            GET
                          </div>
                          <p className="text-xs text-stone-500 mt-1">Only GET is supported for now.</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {currentExecutorType === "input" && (
                <div className="grid grid-cols-1 gap-3 mt-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Input Key</label>
                    <input
                      type="text"
                      value={
                        selectedNode.executor?.type === "input"
                          ? (selectedNode.executor.config as InputExecutorConfig).key || ""
                          : ""
                      }
                      onChange={(e) =>
                        updateNodeNested(selectedNodeId, "executor", {
                          type: "input",
                          config: {
                            ...(selectedNode.executor?.type === "input"
                              ? (selectedNode.executor.config as InputExecutorConfig)
                              : { key: "", type: "text" }),
                            key: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm"
                      placeholder="e.g., userName"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Input Type</label>
                    <select
                      value={
                        selectedNode.executor?.type === "input"
                          ? (selectedNode.executor.config as InputExecutorConfig).type || "text"
                          : "text"
                      }
                      onChange={(e) =>
                        updateNodeNested(selectedNodeId, "executor", {
                          type: "input",
                          config: {
                            ...(selectedNode.executor?.type === "input"
                              ? (selectedNode.executor.config as InputExecutorConfig)
                              : { key: "", type: "text" }),
                            type: e.target.value as "text" | "number",
                          },
                        })
                      }
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm"
                    >
                      <option value="text">text</option>
                      <option value="number">number</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Validation (regex)</label>
                    <input
                      type="text"
                      value={
                        selectedNode.executor?.type === "input"
                          ? (selectedNode.executor.config as InputExecutorConfig).validation || ""
                          : ""
                      }
                      onChange={(e) =>
                        updateNodeNested(selectedNodeId, "executor", {
                          type: "input",
                          config: {
                            ...(selectedNode.executor?.type === "input"
                              ? (selectedNode.executor.config as InputExecutorConfig)
                              : { key: "", type: "text" }),
                            validation: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm"
                      placeholder="^\\d{6,}$"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Retry Limit</label>
                    <input
                      min={0}
                      max={10}
                      type="number"
                      value={
                        selectedNode.executor?.type === "input"
                          ? (selectedNode.executor.config as InputExecutorConfig).retryLimit ?? 0
                          : 0
                      }
                      onChange={(e) =>
                        updateNodeNested(selectedNodeId, "executor", {
                          type: "input",
                          config: {
                            ...(selectedNode.executor?.type === "input"
                              ? (selectedNode.executor.config as InputExecutorConfig)
                              : { key: "", type: "text" }),
                            retryLimit: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm"
                    />
                  </div>
                </div>
              )}

              {currentExecutorType === "input" && (
                <div className="pt-3 border-t border-stone-600 mt-3">
                  <label className="block text-sm font-medium mb-3 text-pink-400">After User Input, Route To</label>
                  <select
                    value={selectedNode.inputNextNodeId || ""}
                    onChange={(e) => updateNode(selectedNodeId, "inputNextNodeId", e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    <option value="">-- Select target node --</option>
                    {bot.nodes.map((node) => (
                      <option key={node.id} value={node.id}>
                        {node.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {currentExecutorType !== "input" && (
              <div className="mb-6 p-4 bg-stone-800/50 rounded-lg border border-stone-700 space-y-3">
                <label className="block text-sm font-medium">Output</label>
                <select
                  value={selectedNode.output.type}
                  onChange={(e) =>
                    updateNodeNested(selectedNodeId, "output", {
                      ...selectedNode.output,
                      type: e.target.value as "text" | "options" | "end",
                    })
                  }
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm"
                >
                  <option value="text">text</option>
                  <option value="options">options</option>
                  <option value="end">end</option>
                </select>

                {selectedNode.output.type === "text" && (
                  <div className="mt-4">
                    <label className="block text-xs font-medium mb-2 text-pink-400">Custom Text to Display</label>
                    <textarea
                      value={selectedNode.output.customText || ""}
                      onChange={(e) =>
                        updateNodeNested(selectedNodeId, "output", {
                          ...selectedNode.output,
                          customText: e.target.value,
                        })
                      }
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm h-24 resize-none"
                      placeholder="Enter the text to show to the user..."
                    />
                  </div>
                )}

                {selectedNode.output.type === "options" && (
                  <div className="mt-4">
                    <div className="mb-4 p-3 bg-stone-800 border border-stone-700 rounded-lg text-xs text-stone-200">
                      Back and End Chat options are attached automatically at runtime.
                    </div>

                    {currentExecutorType === "none" && (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <label className="block text-sm font-medium">Options ({selectedNode.options.length}/5)</label>
                          <Button
                            onClick={() => addOption(selectedNodeId)}
                            size="sm"
                            className="bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={selectedNode.options.length >= 5}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add
                          </Button>
                        </div>

                        {selectedNode.options.length === 0 ? (
                          <div className="p-4 bg-stone-800/50 rounded-lg border border-dashed border-stone-600 text-center">
                            <p className="text-sm text-stone-400">No options yet. Click Add to create one.</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {selectedNode.options.map((option) => (
                              <div
                                key={option.id}
                                onClick={() => setSelectedOptionId(option.id)}
                                className="p-3 bg-stone-800 border border-stone-700 rounded-lg cursor-pointer hover:border-pink-600 hover:bg-stone-800/80 transition-all"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="font-medium text-sm text-white">{option.label}</div>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-stone-600 shrink-0" />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            <Button
              onClick={() => {
                deleteNode(selectedNodeId);
                setSelectedOptionId(null);
              }}
              variant="ghost"
              className="w-full text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Node
            </Button>
          </div>
        ) : (
          <div className="text-sm text-stone-400">Select a node to edit details.</div>
        )}
      </div>
    </div>
  );
}