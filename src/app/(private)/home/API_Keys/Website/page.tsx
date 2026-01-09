
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MdOutlineWeb,
  MdContentCopy,
  MdRefresh,
  MdVisibility,
  MdVisibilityOff,
  MdCheckCircle,
  MdWarning,
  MdAdd,
  MdInfo,
} from "react-icons/md";
import { BiBot, BiKey } from "react-icons/bi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface WebsiteBot {
  id: string;
  name: string;
  apiKey: string;
  status: "active" | "inactive";
  createdAt: string;
  lastUsed: string | null;
  requestCount: number;
}

const WebsiteAPIKeysPage = () => {
  const router = useRouter();

  // Control variables for different states
  const [hasNoBots, setHasNoBots] = useState<boolean>(false); // Change to true to show no bots state
  const [showInactive, setShowInactive] = useState<boolean>(true); // Controls whether to show inactive section

  // Dummy data - replace with real API data later
  const [bots, setBots] = useState<WebsiteBot[]>([
    {
      id: "1",
      name: "Customer Support Bot",
      apiKey: "wsk_live_1234567890abcdefghijklmnopqrstuvwxyz123456",
      status: "active",
      createdAt: "2026-01-05",
      lastUsed: "2026-01-08",
      requestCount: 1247,
    },
    {
      id: "2",
      name: "Sales Assistant Bot",
      apiKey: "wsk_live_9876543210zyxwvutsrqponmlkjihgfedcba654321",
      status: "active",
      createdAt: "2026-01-03",
      lastUsed: "2026-01-07",
      requestCount: 856,
    },
    {
      id: "3",
      name: "FAQ Bot",
      apiKey: "wsk_live_abcd1234efgh5678ijkl9012mnop3456qrst7890",
      status: "inactive",
      createdAt: "2025-12-28",
      lastUsed: "2025-12-30",
      requestCount: 342,
    },
  ]);

  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const activeBots = bots.filter((bot) => bot.status === "active");
  const inactiveBots = bots.filter((bot) => bot.status === "inactive");

  const toggleKeyVisibility = (botId: string) => {
    const newVisibleKeys = new Set(visibleKeys);
    if (newVisibleKeys.has(botId)) {
      newVisibleKeys.delete(botId);
    } else {
      newVisibleKeys.add(botId);
    }
    setVisibleKeys(newVisibleKeys);
  };

  const maskApiKey = (key: string) => {
    if (key.length < 20) return "••••••••••••••••";
    return `${key.substring(0, 12)}${"•".repeat(20)}${key.substring(key.length - 8)}`;
  };

  const copyToClipboard = async (apiKey: string, botId: string) => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopiedKey(botId);
      toast.success("API key copied to clipboard!");
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      toast.error("Failed to copy API key");
    }
  };

  const handleRegenerateKey = (botId: string, botName: string) => {
    // This will be implemented later with actual API call
    toast.success(`Regenerating API key for ${botName}...`);
  };

  const handleCreateBot = () => {
    router.push("/home/CreateBots");
  };

  // No bots state
  if (hasNoBots) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full"
          >
            ←
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-950/30 rounded-xl">
              <MdOutlineWeb className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-white font-outfit">
                Website API Keys
              </h1>
              <p className="text-gray-600 dark:text-gray-400 font-inter text-sm mt-1">
                Manage API keys for your website chatbots
              </p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 bg-green-100 dark:bg-green-950/30 rounded-full mb-4">
              <BiBot className="w-16 h-16 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 font-outfit">
              No Website Bots Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 font-inter text-center max-w-md mb-6">
              You need to create a website bot first before you can generate API keys. 
              Create your first bot to get started with website integration.
            </p>
            <Button
              onClick={handleCreateBot}
              className="font-inter group"
              size="lg"
            >
              <MdAdd className="mr-2 w-5 h-5" />
              Create Your First Bot
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main UI with bots
  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full"
        >
          ←
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 dark:bg-green-950/30 rounded-xl">
            <MdOutlineWeb className="w-8 h-8 text-green-500" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white font-outfit">
              Website API Keys
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-inter text-sm mt-1">
              Manage and monitor your website chatbot API keys
            </p>
          </div>
        </div>
      </div>

      {/* Info Alert */}
      <Card className="border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <MdInfo className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-700 dark:text-gray-300 font-inter">
                <strong>Keep your API keys secure!</strong> Never share them publicly or commit them to version control. 
                Use environment variables in your production environment.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active API Keys Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white font-outfit">
              Active API Keys
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-inter mt-1">
              {activeBots.length} active {activeBots.length === 1 ? "bot" : "bots"}
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {activeBots.map((bot) => (
            <Card
              key={bot.id}
              className="border-green-200 dark:border-green-900/50 dark:bg-gray-900 hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white font-outfit flex items-center gap-2">
                      <BiBot className="w-5 h-5 text-green-500" />
                      {bot.name}
                    </CardTitle>
                    <CardDescription className="mt-2 font-inter">
                      <div className="flex flex-wrap items-center gap-4 text-xs">
                        <span className="flex items-center gap-1">
                          <MdCheckCircle className="w-4 h-4 text-green-500" />
                          Active
                        </span>
                        <span>Created: {bot.createdAt}</span>
                        <span>Last used: {bot.lastUsed || "Never"}</span>
                        <span>{bot.requestCount.toLocaleString()} requests</span>
                      </div>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* API Key Display */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 font-inter">
                    API Key
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        readOnly
                        value={visibleKeys.has(bot.id) ? bot.apiKey : maskApiKey(bot.apiKey)}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-white pr-12"
                      />
                      <button
                        onClick={() => toggleKeyVisibility(bot.id)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      >
                        {visibleKeys.has(bot.id) ? (
                          <MdVisibilityOff className="w-5 h-5" />
                        ) : (
                          <MdVisibility className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => copyToClipboard(bot.apiKey, bot.id)}
                      className="font-inter"
                    >
                      {copiedKey === bot.id ? (
                        <>
                          <MdCheckCircle className="mr-2 w-4 h-4 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <MdContentCopy className="mr-2 w-4 h-4" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handleRegenerateKey(bot.id, bot.name)}
                      className="font-inter text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
                    >
                      <MdRefresh className="mr-2 w-4 h-4" />
                      Regenerate
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-inter">
                    Click the eye icon to reveal the full API key
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Inactive API Keys Section */}
      {showInactive && inactiveBots.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white font-outfit">
                Inactive API Keys
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-inter mt-1">
                {inactiveBots.length} inactive {inactiveBots.length === 1 ? "bot" : "bots"}
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {inactiveBots.map((bot) => (
              <Card
                key={bot.id}
                className="border-gray-300 dark:border-gray-700 opacity-75 hover:opacity-100 transition-opacity"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white font-outfit flex items-center gap-2">
                        <BiBot className="w-5 h-5 text-gray-500" />
                        {bot.name}
                      </CardTitle>
                      <CardDescription className="mt-2 font-inter">
                        <div className="flex flex-wrap items-center gap-4 text-xs">
                          <span className="flex items-center gap-1">
                            <MdWarning className="w-4 h-4 text-yellow-500" />
                            Inactive
                          </span>
                          <span>Created: {bot.createdAt}</span>
                          <span>Last used: {bot.lastUsed || "Never"}</span>
                          <span>{bot.requestCount.toLocaleString()} requests</span>
                        </div>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 font-inter">
                      API Key
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          readOnly
                          value={visibleKeys.has(bot.id) ? bot.apiKey : maskApiKey(bot.apiKey)}
                          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-white pr-12 opacity-60"
                        />
                        <button
                          onClick={() => toggleKeyVisibility(bot.id)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                          {visibleKeys.has(bot.id) ? (
                            <MdVisibilityOff className="w-5 h-5" />
                          ) : (
                            <MdVisibility className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => copyToClipboard(bot.apiKey, bot.id)}
                        className="font-inter"
                      >
                        {copiedKey === bot.id ? (
                          <>
                            <MdCheckCircle className="mr-2 w-4 h-4 text-green-500" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <MdContentCopy className="mr-2 w-4 h-4" />
                            Copy
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => handleRegenerateKey(bot.id, bot.name)}
                        className="font-inter text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
                        disabled
                      >
                        <MdRefresh className="mr-2 w-4 h-4" />
                        Regenerate
                      </Button>
                    </div>
                    <p className="text-xs text-yellow-600 dark:text-yellow-500 font-inter flex items-center gap-1">
                      <MdWarning className="w-3 h-3" />
                      This bot is inactive. Activate it to regenerate the API key.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Help Section */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-900/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <BiKey className="w-6 h-6 text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 font-outfit">
                How to Use Your API Key
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-inter mb-3">
                Include your API key in the request headers when making calls to the Nova Bot API:
              </p>
              <div className="bg-gray-900 dark:bg-black rounded-lg p-4 font-mono text-sm text-green-400 overflow-x-auto">
                <code>
                  {`Authorization: Bearer YOUR_API_KEY`}
                  <br />
                  {`Content-Type: application/json`}
                </code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsiteAPIKeysPage;
