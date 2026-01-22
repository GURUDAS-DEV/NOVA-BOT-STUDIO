"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";

// Option is now a pure routing edge
interface BotOption {
  id: string;
  label: string;
  nextNodeId: string;
  actionType?: "normal" | "back" | "end"; // Special action types
}

// Node-centric FSM schema
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
  // Next node ID for input executor
  inputNextNodeId?: string;
  output: {
    type: "text" | "options" | "end";
    customText?: string; // Custom text to display when output type is "text"
    controls?: {
      allowBack?: boolean;
      allowEnd?: boolean;
    };
  };
  // Options source: static (user-defined) or dynamic (from API)
  optionsSource?: "static" | "dynamic";
  // API response mapping (only when optionsSource = dynamic)
  apiResponseMapping?: {
    dataField: string; // Path to array in API response (e.g., "data.items")
    labelField: string; // Field to use as option label (e.g., "name")
    valueField: string; // Field to use for routing (e.g., "id")
    nextNodeId: string; // Target node for all dynamic options
  };
  options: BotOption[];
}

interface Bot {
  id: string;
  name: string;
  nodes: BotNode[];
}

export default function ControlledBotBuilder() {
  const botId = "bot-1";
  const botName = "Support Bot";

  const [bot, setBot] = useState<Bot>({
    id: botId,
    name: botName,
    nodes: [
      {
        id: "node-1",
        title: "Welcome",
        message: "Hi! How can I help you today?",
        output: { type: "options", controls: { allowBack: false, allowEnd: true } },
        options: [
          { id: "opt-1", label: "Check Order", nextNodeId: "node-2" },
        ],
      },
      {
        id: "node-2",
        title: "Order Details",
        message: "Please enter your order number:",
        input: { key: "orderNumber", type: "text", validation: "^\\d{6,}$", retryLimit: 2 },
        executor: { type: "api", config: { endpoint: "https://api.example.com/orders", method: "GET" } },
        output: { type: "text", controls: { allowBack: true, allowEnd: true } },
        optionsSource: "static",
        options: [],
      },
    ],
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string>("node-1");
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [testData, setTestData] = useState<{ label: string; value: string }[] | null>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);

  const selectedNode = bot.nodes.find((n) => n.id === selectedNodeId);
  const selectedOption = selectedNode?.options.find((o) => o.id === selectedOptionId);


  const createControlledStyleBot = async () => {
    try{
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bot/createControlledBot`, {
        method : "POST",
        headers : {
          "Content-Type": "application/json "
        },
        body: JSON.stringify({ bot }),
        credentials : 'include',
      })

      const data = await response.json();
      if(!response.ok){
        toast.error("Failed to create controlled style bot");
        console.log("Failed response:", data);
      }else{
        toast.success("Controlled style bot created successfully!");
        console.log("Bot created:", data);
      }
    }
    catch(e){
      console.error("Error creating controlled style bot:", e);
    }
  }

  // Preview mode helpers: options only route to next node
  // Preview helpers removed in this editor-only view

  // Edit mode helpers: node-centric
  const updateNode = <K extends keyof BotNode>(nodeId: string, field: K, value: BotNode[K]) => {
    setBot((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => (n.id === nodeId ? { ...n, [field]: value } : n)),
    }));
  };

  const updateNodeNested = (
    nodeId: string,
    path: "input" | "executor" | "output",
    value: BotNode["input" | "executor" | "output"]
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
    value: BotOption[K]
  ) => {
    setBot((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              options: n.options.map((o) => (o.id === optionId ? { ...o, [field]: value } : o)),
            }
          : n
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
    setBot((prev) => ({ ...prev, nodes: prev.nodes.filter((n) => n.id !== nodeId) }));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(bot.nodes[0].id);
      setSelectedOptionId(null);
    }
  };

  const addOption = (nodeId: string) => {
    if (selectedNode && selectedNode.options.length >= 5) {
      alert("Maximum 5 options allowed per node");
      return;
    }
    const newOptionId = `opt-${Date.now()}`;
    const newOption: BotOption = { id: newOptionId, label: "New Option", nextNodeId: "", actionType: "normal" };
    updateNode(nodeId, "options", [...(selectedNode?.options || []), newOption]);
  };

  const deleteOption = (nodeId: string, optionId: string) => {
    const node = bot.nodes.find((n) => n.id === nodeId);
    if (node) {
      updateNode(nodeId, "options", node.options.filter((o) => o.id !== optionId));
    }
  };

  // Executor selector helpers
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

  // Test API connectivity only
  const testApiOptions = async () => {
    if (!selectedNode?.executor || selectedNode.executor.type !== "api") {
      setTestError("No API executor configured");
      return;
    }

    const apiConfig = selectedNode.executor.config as ApiExecutorConfig;

    if (!apiConfig.endpoint) {
      setTestError("Please configure the API endpoint first");
      return;
    }

    setTestLoading(true);
    setTestError(null);
    setTestData(null);

    try {
      const response = await fetch(apiConfig.endpoint, {
        method: apiConfig.method,
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }

      await response.json();
      
      setTestData([{ label: "API is working correctly!", value: "success" }]);
    } catch (error) {
      setTestError(error instanceof Error ? error.message : "Unknown error occurred");
    } finally {
      setTestLoading(false);
    }
  };

  // Link tested option to target node
  


  return (
    <div className="flex flex-col lg:flex-row h-screen bg-stone-900 text-white font-inter">
      {/* Left: Node Flow Visualization */}
      <Toaster richColors position="top-right" />
      <div className="flex-1 border-b lg:border-b-0 lg:border-r border-stone-700 p-6 overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex justify-center items-start flex-col">
            <h2 className="text-lg font-outfit font-bold">Node Flow</h2>
            <h2 className="text-sm font-outfit">You can visualize the bot after the creation on bot playground.</h2>
          </div>
          <Button onClick={addNode} className="bg-pink-600 hover:bg-pink-700" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Node
          </Button>
        </div>

        <div className="max-w-2xl space-y-6">
          {/* Node list with flow */}
          {bot.nodes.map((node, nodeIdx) => (
            <div key={node.id} className="space-y-3">
              {/* Node card */}
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

              {/* Options for this node */}
              {node.options.length > 0 && (
                <div className="ml-4 space-y-2">
                  {node.options.map((option) => {
                    const nextNode = option.nextNodeId
                      ? bot.nodes.find((n) => n.id === option.nextNodeId)
                      : null;
                    const isSelected = selectedOptionId === option.id && selectedNodeId === node.id;

                    return (
                      <div key={option.id} className="space-y-2">
                        {/* Option button */}
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

                        {/* Link indicator */}
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

              {/* Arrow to next visual block */}
              {nodeIdx < bot.nodes.length - 1 && (
                <div className="flex justify-center py-2">
                  <div className="text-stone-600">↓</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right: Editor Panel */}
      <div className="w-full lg:w-96 border-t lg:border-t-0 border-stone-700 p-6 overflow-y-auto flex flex-col">
        {selectedOption ? (
          // Edit Option - routing only
          <div>
            {/* Breadcrumb */}
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

            {/* Option Label */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Option Label</label>
              <input
                type="text"
                value={selectedOption.label}
                onChange={(e) => updateOption(selectedNodeId, selectedOptionId!, "label", e.target.value)}
                disabled={selectedOption.actionType === "back" || selectedOption.actionType === "end"}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white placeholder-stone-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Action Type - Back or End */}
            <div className="mb-6 p-4 bg-stone-800/50 rounded-lg border border-stone-700 space-y-3">
              <label className="block text-sm font-medium mb-3">Action Type</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedOption.actionType === "back"}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateOption(selectedNodeId, selectedOptionId!, "actionType", "back");
                        updateOption(selectedNodeId, selectedOptionId!, "label", "go back");
                      } else if (selectedOption.actionType === "back") {
                        updateOption(selectedNodeId, selectedOptionId!, "actionType", "normal");
                        updateOption(selectedNodeId, selectedOptionId!, "label", "New Option");
                      }
                    }}
                    className="w-4 h-4"
                  />
                  Mark as Back
                </label>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedOption.actionType === "end"}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateOption(selectedNodeId, selectedOptionId!, "actionType", "end");
                        updateOption(selectedNodeId, selectedOptionId!, "label", "End Conversation");
                      } else if (selectedOption.actionType === "end") {
                        updateOption(selectedNodeId, selectedOptionId!, "actionType", "normal");
                        updateOption(selectedNodeId, selectedOptionId!, "label", "New Option");
                      }
                    }}
                    className="w-4 h-4"
                  />
                  Mark as End
                </label>
              </div>
            </div>

            {/* Link to next node - Hidden for back/end actions */}
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
          // Edit Node
          <div>
            <div className="mb-6 pb-4 border-b border-stone-700">
              <h3 className="text-sm font-medium text-stone-400">Editing Node</h3>
              <h2 className="text-lg font-outfit font-bold text-pink-400 mt-1">{selectedNode.title}</h2>
            </div>

            {/* Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Node Title</label>
              <input
                type="text"
                value={selectedNode.title}
                onChange={(e) => updateNode(selectedNodeId, "title", e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white placeholder-stone-500"
              />
            </div>

            {/* Message */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                value={selectedNode.message}
                onChange={(e) => updateNode(selectedNodeId, "message", e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white placeholder-stone-500 h-24 resize-none"
              />
            </div>

            {/* Executor */}
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
                    <p className="text-xs text-stone-500 mt-1">Bot can only retrieve data using GET requests</p>
                  </div>
                  
                  {/* Query Parameters Toggle */}
                  <div className="pt-3 border-t border-stone-600">
                    <label className="flex items-center gap-2 text-xs cursor-pointer mb-3">
                      <input
                        type="checkbox"
                        checked={(apiConfig?.params?.length || 0) > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateNodeNested(selectedNodeId, "executor", {
                              type: "api",
                              config: {
                                ...(apiConfig || { endpoint: "", method: "GET" }),
                                params: [{ key: "", value: "" }],
                              },
                            });
                          } else {
                            updateNodeNested(selectedNodeId, "executor", {
                              type: "api",
                              config: {
                                ...(apiConfig || { endpoint: "", method: "GET" }),
                                params: undefined,
                              },
                            });
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span className="font-medium">Has Query Parameters?</span>
                    </label>
                    
                    {/* Query Parameters Input Fields */}
                    {apiConfig?.params && apiConfig.params.length > 0 && (
                      <div className="space-y-2">
                        {apiConfig.params.map((param, index) => (
                          <div key={index} className="flex gap-2 items-start">
                            <div className="flex-1">
                              <input
                                type="text"
                                value={param.key}
                                onChange={(e) => {
                                  const newParams = [...(apiConfig.params || [])];
                                  newParams[index] = { ...newParams[index], key: e.target.value };
                                  updateNodeNested(selectedNodeId, "executor", {
                                    type: "api",
                                    config: {
                                      ...apiConfig,
                                      params: newParams,
                                    },
                                  });
                                }}
                                className="w-full bg-stone-700 border border-stone-600 rounded-lg px-3 py-2 text-white text-xs"
                                placeholder="Key (e.g., userId)"
                              />
                            </div>
                            <div className="flex-1">
                              <input
                                type="text"
                                value={param.value}
                                onChange={(e) => {
                                  const newParams = [...(apiConfig.params || [])];
                                  newParams[index] = { ...newParams[index], value: e.target.value };
                                  updateNodeNested(selectedNodeId, "executor", {
                                    type: "api",
                                    config: {
                                      ...apiConfig,
                                      params: newParams,
                                    },
                                  });
                                }}
                                className="w-full bg-stone-700 border border-stone-600 rounded-lg px-3 py-2 text-white text-xs"
                                placeholder="Value (e.g., 123)"
                              />
                            </div>
                            <button
                              onClick={() => {
                                const newParams = apiConfig.params?.filter((_, i) => i !== index) || [];
                                updateNodeNested(selectedNodeId, "executor", {
                                  type: "api",
                                  config: {
                                    ...apiConfig,
                                    params: newParams.length > 0 ? newParams : undefined,
                                  },
                                });
                              }}
                              className="p-2 bg-red-600/20 hover:bg-red-600/30 border border-red-600 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3 h-3 text-red-400" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newParams = [...(apiConfig.params || []), { key: "", value: "" }];
                            updateNodeNested(selectedNodeId, "executor", {
                              type: "api",
                              config: {
                                ...apiConfig,
                                params: newParams,
                              },
                            });
                          }}
                          className="w-full p-2 bg-stone-700 hover:bg-stone-600 border border-stone-600 rounded-lg text-xs text-white transition-colors flex items-center justify-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Add Parameter
                        </button>
                        <p className="text-xs text-stone-500 mt-2">Query params will be appended to the URL (e.g., ?userId=123&type=order)</p>
                      </div>
                    )}
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
                            ...(selectedNode.executor?.type === "input" ? (selectedNode.executor.config as InputExecutorConfig) : { key: "", type: "text" }),
                            key: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm"
                      placeholder="e.g., userName, orderNumber"
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
                            ...(selectedNode.executor?.type === "input" ? (selectedNode.executor.config as InputExecutorConfig) : { key: "", type: "text" }),
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
                            ...(selectedNode.executor?.type === "input" ? (selectedNode.executor.config as InputExecutorConfig) : { key: "", type: "text" }),
                            validation: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm"
                      placeholder="^\\d{6,}$"
                    />
                    <p className="text-xs text-stone-500 mt-1">e.g., for 6+ digits use: (6 or more)</p>
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
                            ...(selectedNode.executor?.type === "input" ? (selectedNode.executor.config as InputExecutorConfig) : { key: "", type: "text" }),
                            retryLimit: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Input Executor - Link to Node */}
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
                  <p className="text-xs text-stone-500 mt-2">Select which node to navigate to after user provides input</p>
                </div>
              )}
            </div>

            {/* Output - Hidden when executor is input */}
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
              
              {/* Custom Text Input - Show when output type is text */}
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
                  <p className="text-xs text-stone-500 mt-2">This text will be displayed to the user when they reach this node</p>
                </div>
              )}

              {/* Options editor enable only if output type is options */}
              {selectedNode.output.type === "options" && (
                <div className="mt-4">
                  {/* API Executor - Test and Bind Dynamic Options */}
                  {currentExecutorType === "api" && (
                    <div className="p-4 bg-stone-800/50 rounded-lg border border-stone-700 space-y-3">
                      <Button
                        onClick={testApiOptions}
                        disabled={testLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        {testLoading ? "Testing..." : "Test API"}
                      </Button>

                      {/* Test Error */}
                      {testError && (
                        <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg">
                          <p className="text-xs text-red-300">{testError}</p>
                        </div>
                      )}

                      {/* Test Success */}
                      {testData && testData.length > 0 && (
                        <div className="p-3 bg-green-900/30 border border-green-700 rounded-lg">
                          <p className="text-xs text-green-300 font-medium">✓ API is working correctly and will return options at runtime of bot.</p>
                        </div>
                      )}

                      {/* Target Node for Dynamic Options */}
                      <div className="pt-3 border-t border-stone-600">
                        <label className="block text-sm font-medium mb-3">Route Dynamic Options To</label>
                        <select
                          value={selectedNode.apiResponseMapping?.nextNodeId || ""}
                          onChange={(e) => {
                            if (e.target.value) {
                              updateNode(selectedNodeId, "apiResponseMapping", {
                                dataField: selectedNode.apiResponseMapping?.dataField || "data",
                                labelField: selectedNode.apiResponseMapping?.labelField || "label",
                                valueField: selectedNode.apiResponseMapping?.valueField || "value",
                                nextNodeId: e.target.value,
                              });
                            } else {
                              updateNode(selectedNodeId, "apiResponseMapping", undefined);
                            }
                          }}
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

                      {/* API Response Mapping Configuration */}
                      {selectedNode.apiResponseMapping && (
                        <div className="mt-4 p-3 bg-stone-800 border border-stone-700 rounded-lg space-y-3">
                          <label className="block text-sm font-medium text-pink-400">API Response Mapping</label>
                          <div>
                            <label className="block text-xs font-medium mb-1">Data Field Path</label>
                            <input
                              type="text"
                              value={selectedNode.apiResponseMapping.dataField}
                              onChange={(e) =>
                                updateNode(selectedNodeId, "apiResponseMapping", {
                                  ...selectedNode.apiResponseMapping!,
                                  dataField: e.target.value,
                                })
                              }
                              className="w-full bg-stone-700 border border-stone-600 rounded-lg px-3 py-2 text-white text-sm"
                              placeholder="data.items"
                            />
                            <p className="text-xs text-stone-500 mt-1">e.g., &quot;data&quot;, &quot;data.items&quot;</p>
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Label Field</label>
                            <input
                              type="text"
                              value={selectedNode.apiResponseMapping.labelField}
                              onChange={(e) =>
                                updateNode(selectedNodeId, "apiResponseMapping", {
                                  ...selectedNode.apiResponseMapping!,
                                  labelField: e.target.value,
                                })
                              }
                              className="w-full bg-stone-700 border border-stone-600 rounded-lg px-3 py-2 text-white text-sm"
                              placeholder="name"
                            />
                            <p className="text-xs text-stone-500 mt-1">Field to display as option label</p>
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Value Field</label>
                            <input
                              type="text"
                              value={selectedNode.apiResponseMapping.valueField}
                              onChange={(e) =>
                                updateNode(selectedNodeId, "apiResponseMapping", {
                                  ...selectedNode.apiResponseMapping!,
                                  valueField: e.target.value,
                                })
                              }
                              className="w-full bg-stone-700 border border-stone-600 rounded-lg px-3 py-2 text-white text-sm"
                              placeholder="id"
                            />
                            <p className="text-xs text-stone-500 mt-1">Field to use for routing</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* None Executor - Show Standard Options */}
                  {currentExecutorType === "none" && (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium">Options ({selectedNode.options.length}/5)</label>
                        <Button
                          onClick={() => addOption(selectedNodeId)}
                          size="sm"
                          className="bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={selectedNode.options.length >= 5}
                          title={selectedNode.options.length >= 5 ? "Maximum 5 options per node" : ""}
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

                  {/* Input Executor - No Options Needed (routes directly via inputNextNodeId) */}
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
        ) : null}
        
        {/* Create Bot Button */}
        <div className="mt-auto pt-6 border-t border-stone-700">
          <Button
            onClick={createControlledStyleBot}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-3"
          >
            Create Controlled Style Bot
          </Button>
        </div>
      </div>
    </div>
  );
}
