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
type ApiExecutorConfig = { endpoint: string; method: "GET" | "POST" | "PUT" };
type LlmExecutorConfig = { prompt: string };
type Executor =
  | { type: "api"; config: ApiExecutorConfig }
  | { type: "llm"; config: LlmExecutorConfig };

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
  output: {
    type: "text" | "options" | "end";
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
        executor: { type: "api", config: { endpoint: "https://api.example.com/orders", method: "POST" } },
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
    const newOption: BotOption = { id: newOptionId, label: "New Option", nextNodeId: "" };
    updateNode(nodeId, "options", [...(selectedNode?.options || []), newOption]);
  };

  const deleteOption = (nodeId: string, optionId: string) => {
    const node = bot.nodes.find((n) => n.id === nodeId);
    if (node) {
      updateNode(nodeId, "options", node.options.filter((o) => o.id !== optionId));
    }
  };

  // Executor selector helpers
  const setExecutorType = (nodeId: string, type: "none" | "api" | "llm") => {
    if (type === "none") {
      updateNodeNested(nodeId, "executor", undefined);
    } else if (type === "api") {
      updateNodeNested(nodeId, "executor", { type: "api", config: { endpoint: "", method: "GET" } });
    } else {
      updateNodeNested(nodeId, "executor", { type: "llm", config: { prompt: "" } });
    }
  };

  const currentExecutorType: "none" | "api" | "llm" = selectedNode?.executor?.type
    ? (selectedNode.executor.type as "api" | "llm")
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
  const addActionOption = (actionType: "back" | "end") => {
    const label = actionType === "back" ? "go back" : "end conversation";
    const newOption: BotOption = {
      id: `opt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      label,
      nextNodeId: "",
      actionType,
    };

    updateNode(selectedNodeId, "options", [...(selectedNode?.options || []), newOption]);
    toast.success(`Option "${label}" added`);
  };



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
                        updateOption(selectedNodeId, selectedOptionId!, "label", "end conversation");
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
            {selectedOption.actionType === "normal" && (
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

            {/* Input schema */}
            <div className="mb-6 p-4 bg-stone-800/50 rounded-lg border border-stone-700 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">User Input (optional)</label>
                <Button
                  size="sm"
                  className="bg-stone-700 hover:bg-stone-600"
                  onClick={() =>
                    updateNodeNested(selectedNodeId, "input", selectedNode.input ? undefined : { key: "", type: "text" })
                  }
                >
                  {selectedNode.input ? "Remove" : "Add"}
                </Button>
              </div>
              {selectedNode.input && (
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Key</label>
                    <input
                      type="text"
                      value={selectedNode.input.key}
                      onChange={(e) =>
                        updateNodeNested(selectedNodeId, "input", { ...selectedNode.input!, key: e.target.value })
                      }
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Type</label>
                    <select
                      value={selectedNode.input.type}
                      onChange={(e) =>
                        updateNodeNested(selectedNodeId, "input", {
                          ...selectedNode.input!,
                          type: e.target.value as "text" | "number",
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
                      value={selectedNode.input.validation || ""}
                      onChange={(e) =>
                        updateNodeNested(selectedNodeId, "input", {
                          ...selectedNode.input!,
                          validation: e.target.value,
                        })
                      }
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm"
                      placeholder="^\\d{6,}$"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Retry Limit</label>
                    <input
                      type="number"
                      value={selectedNode.input.retryLimit ?? 0}
                      onChange={(e) =>
                        updateNodeNested(selectedNodeId, "input", {
                          ...selectedNode.input!,
                          retryLimit: Number(e.target.value),
                        })
                      }
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Executor */}
            <div className="mb-6 p-4 bg-stone-800/50 rounded-lg border border-stone-700 space-y-3">
              <label className="block text-sm font-medium">Executor</label>
              <div className="grid grid-cols-3 gap-2">
                {(["none", "api", "llm"] as const).map((t) => (
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
                    );
                  })()}
                  <div>
                    <label className="block text-xs font-medium mb-1">Method</label>
                    <select
                      value={
                        selectedNode.executor?.type === "api"
                          ? (selectedNode.executor.config as ApiExecutorConfig).method || "GET"
                          : "GET"
                      }
                      onChange={(e) => {
                        const apiConfig =
                          selectedNode.executor?.type === "api"
                            ? (selectedNode.executor.config as ApiExecutorConfig)
                            : { endpoint: "", method: "GET" as const };
                        updateNodeNested(selectedNodeId, "executor", {
                          type: "api",
                          config: {
                            ...apiConfig,
                            method: e.target.value as "GET" | "POST" | "PUT",
                          },
                        });
                      }}
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                    </select>
                  </div>
                </div>
              )}

              {currentExecutorType === "llm" && (
                <div className="mt-3">
                  <label className="block text-xs font-medium mb-1">LLM Prompt</label>
                  <textarea
                    value={
                      selectedNode.executor?.type === "llm"
                        ? ((selectedNode.executor.config as LlmExecutorConfig).prompt || "")
                        : ""
                    }
                    onChange={(e) =>
                      updateNodeNested(selectedNodeId, "executor", {
                        type: "llm",
                        config: { prompt: e.target.value },
                      })
                    }
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm h-20 resize-none"
                    placeholder="Enter prompt for the LLM..."
                  />
                </div>
              )}
            </div>

            {/* Output */}
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
              

              {/* Options editor enable only if output type is options */}
              {selectedNode.output.type === "options" && (
                <div className="mt-4">
                  {/* API Executor - Show Test Button and Action Options */}
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
                          <p className="text-xs text-green-300 font-medium">✓ API is working correctly and will return {selectedNode.output.type} at runtime of bot.</p>
                        </div>
                      )}

                      {/* Add Action Options */}
                      <div className="pt-3 border-t border-stone-600">
                        <label className="block text-sm font-medium mb-3">Add Special Actions</label>
                        <div className="space-y-2">
                          <Button
                            onClick={() => addActionOption("back")}
                            disabled={selectedNode.options.some((o) => o.actionType === "back")}
                            size="sm"
                            className="w-full bg-stone-700 hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            + Add &quot;Go Back&quot;
                          </Button>
                          <Button
                            onClick={() => addActionOption("end")}
                            disabled={selectedNode.options.some((o) => o.actionType === "end")}
                            size="sm"
                            className="w-full bg-stone-700 hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            + Add &quot;End Conversation&quot;
                          </Button>
                        </div>
                      </div>

                      {/* Action Options Summary */}
                      {selectedNode.options.length > 0 && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-2">Added Options ({selectedNode.options.length})</label>
                          <div className="space-y-2">
                            {selectedNode.options.map((option) => (
                              <div
                                key={option.id}
                                className="p-3 bg-stone-800 border border-green-700 rounded-lg flex items-start justify-between"
                              >
                                <div className="flex-1">
                                  <div className="font-medium text-sm text-white">{option.label}</div>
                                  <div className="text-xs text-stone-400">{option.actionType === "back" ? "Goes back" : "Ends conversation"}</div>
                                </div>
                                <button
                                  onClick={() => deleteOption(selectedNodeId, option.id)}
                                  className="text-red-400 hover:text-red-300 text-xs"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Non-API Executor - Show Standard Options */}
                  {currentExecutorType !== "api" && (
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
                </div>
              )}
            </div>

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
        <button
          className="h-7 w-40 bg-white text-black mt-4"
          onClick={() => console.log("Bot : ", bot)}
        >
          Click
        </button>
      </div>
    </div>
  );
}
