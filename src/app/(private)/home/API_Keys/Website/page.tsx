
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MdOutlineWeb,
  MdRefresh,
  MdWarning,
  MdAdd,
  MdInfo,
  MdSettings,
} from "react-icons/md";
import { BiBot, BiKey } from "react-icons/bi";
import { Card, CardContent} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import DailogApiBox from "../../ManageBots/dailog/DailogApiBox";

interface WebsiteBot {
  _id: string;
  userId : string;
  botName: string;
  botDescription: string;
  platform: "Website";
  status : "active" | "inactive" | "paused";
  created_at: string;
  lastUsed: string | null;
  requestCount: number;
}

const WebsiteAPIKeysPage = () => {
  const router = useRouter();

  // Control variables for different states
  const [hasNoBots, setHasNoBots] = useState<boolean>(false); // Change to true to show no bots state
  const [showInactive, setShowInactive] = useState<boolean>(true); // Controls whether to show inactive section
  const [isLoadingForRegenerate, setIsLoadingForRegenerate] = useState<boolean>(false);
  const [regenratedApiKey, setRegeneratedApiKey] = useState<string>("");
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);
  
  // Dummy data - replace with real API data later
  const [bots, setBots] = useState<WebsiteBot[]>([]);

  const activeBots = bots.filter((bot) => bot.status === "active");
  const inactiveBots = bots.filter((bot) => bot.status === "inactive");

  const getBots = async()=>{
    try{
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/APIKeyManagement/GetApiKeyForWebsite`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if(!response.ok){
        toast.error("Failed to fetch bots");
        throw new Error("Failed to fetch bots");
      }

      const data = await response.json();

      setBots(data.bots);
    }
    catch(e){
      setHasNoBots(true);
      console.error("Error fetching bots:", e);
    }
    finally{
      
    }
  }

  const generateNewApiKey = async(botId : string) : Promise<void>=>{
    try{
      setIsLoadingForRegenerate(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/APIKeyManagement/GenerateNewApiKeyForWebsite`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ botId }),
        })
        if(!response.ok){
          toast.error("Failed to generate new API key");
          throw new Error("Failed to generate new API key");
        } 

        const data = await response.json();
        console.log(data);
        setRegeneratedApiKey(data.apiKey);
        setShowApiKeyModal(true);
    }
    catch(e){
      console.log(e);
      toast.error("Error generating new API key");
    }
    finally{
      setIsLoadingForRegenerate(false);
    }
  }

  useEffect(()=>{
    getBots();
  }, [])




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

  if(isLoadingForRegenerate){
    return (
      <div className="absolute  z-10 flex justify-center items-center w-screen h-screen bg-pink-50 dark:bg-black">
        <div className="flex flex-col justify-center items-center">
           <div className="h-10 w-10 border-2 border-gray-500 border-b-black animate-spin rounded-full">
           </div>
           <div>
            <p>Generating new API key...</p>
           </div>
        </div>
      </div>
    )

  }

  // Main UI with bots
  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      <DailogApiBox apiKey={regenratedApiKey} open={showApiKeyModal} onOpenChange={() => setShowApiKeyModal(false)} />
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
              Manage and regenerate your website chatbot API keys
            </p>
          </div>
        </div>
      </div>

      {/* Info Alert */}
      <Card className="border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <MdInfo className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-700 dark:text-gray-300 font-inter leading-relaxed">
                <strong>Keep your API keys secure!</strong> API keys are only shown once during generation. 
                If you need access to your key again, regenerate it from this page.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Bots Section */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white font-outfit">
              Active Bots
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-inter mt-1">
              {activeBots.length} active {activeBots.length === 1 ? "bot" : "bots"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {activeBots.map((bot) => (
            <Card
              key={bot._id}
              className="border-gray-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:shadow-lg hover:border-green-300 dark:hover:border-green-700 transition-all"
            >
              <CardContent className="p-6 space-y-4">
                {/* Bot Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="p-2.5 bg-green-100 dark:bg-green-950/30 rounded-lg shrink-0">
                      <BiBot className="w-5 h-5 text-green-500" />
                    </div> 
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-outfit truncate">
                        {bot.botName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bot Stats */}
                <div className="grid grid-cols-3 gap-3 py-3 px-3 bg-gray-50 dark:bg-stone-800/50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-inter mb-0.5">
                      Created
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white font-outfit">
                      {new Date(bot.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-inter mb-0.5">
                      Last Used
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white font-outfit">
                      {bot.lastUsed ? new Date(bot.lastUsed).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "Never"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-inter mb-0.5">
                      Requests
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white font-outfit">
                      101
                    </p>
                  </div>
                </div>

                {/* Regenerate Button */}
                <Button
                  onClick={() => generateNewApiKey(bot._id)}
                  className="w-full bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-inter"
                  size="lg"
                >
                  <MdRefresh className="mr-2 w-5 h-5" />
                  Regenerate API Key
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Inactive Bots Section */}
      {showInactive && inactiveBots.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white font-outfit">
                Inactive Bots
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-inter mt-1">
                {inactiveBots.length} inactive {inactiveBots.length === 1 ? "bot" : "bots"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {inactiveBots.map((bot) => (
              <Card
                key={bot._id}
                className="border-gray-300 dark:border-stone-700 bg-white dark:bg-stone-900 opacity-80 hover:opacity-100 transition-all"
              >
                <CardContent className="p-6 space-y-4">
                  {/* Bot Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-lg shrink-0">
                        <BiBot className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-outfit truncate">
                          {bot.botName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-600 dark:text-yellow-500">
                            <MdWarning className="w-3.5 h-3.5" />
                            Inactive
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Info Message */}
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/50 rounded-lg">
                    <p className="text-xs text-yellow-800 dark:text-yellow-300 font-inter leading-relaxed">
                      This bot is currently inactive. Activate it from the Manage Bots page to regenerate API keys.
                    </p>
                  </div>

                  {/* Go to Manage Bots Button */}
                  <Button
                    onClick={() => router.push("/home/ManageBots")}
                    variant="outline"
                    className="w-full font-inter border-gray-300 dark:border-stone-700 hover:bg-gray-50 dark:hover:bg-stone-800"
                    size="lg"
                  >
                    <MdSettings className="mr-2 w-5 h-5" />
                    Go to Manage Bots
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Help Section */}
      <Card className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:bg-gray-900 dark:border-green-900/50">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-500/10 rounded-xl shrink-0">
              <BiKey className="w-6 h-6 text-green-500" />
            </div>
            <div className="flex-1 space-y-3">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white font-outfit">
                How to Use Your API Key
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-inter leading-relaxed">
                When you regenerate an API key, it will be displayed once in a secure dialog. 
                Copy it immediately and store it safely. Include your API key in request headers:
              </p>
              <div className="bg-gray-900 dark:bg-black rounded-xl p-4 font-mono text-sm text-green-400 overflow-x-auto">
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
