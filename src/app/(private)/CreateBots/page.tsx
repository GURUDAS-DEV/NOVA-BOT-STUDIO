
"use client";

import React, { useState } from "react";
import { 
  FaTelegram, 
  FaDiscord, 
  FaInstagram, 
  FaWhatsapp 
} from "react-icons/fa";
import { 
  MdOutlineWeb,
  MdChat,
  MdSearch,
  MdAutoMode,
  MdCheckCircle
} from "react-icons/md";
import { BiBot, BiData, BiCloud } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useAuthStore } from "@/lib/Store/store";

const CreateBotPage = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [botType, setBotType] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string | null>(null);
  const [botName, setBotName] = useState<string>("");
  const [botDescription, setBotDescription] = useState<string>("");

  const {userId} =  useAuthStore();

  const platforms = [
    { 
      id: "Telegram", 
      name: "Telegram", 
      icon: FaTelegram, 
      color: "text-blue-500", 
      bgColor: "bg-blue-100 dark:bg-blue-950/30",
      isPaid: false 
    },
    { 
      id: "Discord", 
      name: "Discord", 
      icon: FaDiscord, 
      color: "text-indigo-500", 
      bgColor: "bg-indigo-100 dark:bg-indigo-950/30",
      isPaid: false 
    },
    { 
      id: "API", 
      name: "Website", 
      icon: MdOutlineWeb, 
      color: "text-green-500", 
      bgColor: "bg-green-100 dark:bg-green-950/30",
      isPaid: false 
    },
    { 
      id: "Instagram", 
      name: "Instagram", 
      icon: FaInstagram, 
      color: "text-pink-500", 
      bgColor: "bg-pink-100 dark:bg-pink-950/30",
      isPaid: true 
    },
    { 
      id: "WhatsApp", 
      name: "WhatsApp", 
      icon: FaWhatsapp, 
      color: "text-emerald-500", 
      bgColor: "bg-emerald-100 dark:bg-emerald-950/30",
      isPaid: true 
    },
  ];

  const botTypes = [
    {
      id: "chatbot",
      title: "AI Chatbot",
      description: "Natural conversations powered by AI",
      icon: MdChat,
      color: "text-purple-500"
    },
    {
      id: "search",
      title: "Search Bot",
      description: "Search movies, data, FAQs, and more",
      icon: MdSearch,
      color: "text-blue-500"
    },
    {
      id: "automation",
      title: "Automation Bot",
      description: "Auto-replies, workflows, and triggers",
      icon: MdAutoMode,
      color: "text-orange-500"
    },
  ];

  const dataSources = [
    {
      id: "AI",
      title: "AI Powered",
      description: "Use LLM for intelligent responses",
      icon: Sparkles,
    },
    {
      id: "DB",
      title: "Database",
      description: "Connect your own data source",
      icon: BiData,
    },
    {
      id: "API",
      title: "External API",
      description: "Integrate third-party services",
      icon: BiCloud,
    },
  ];

  const getPlatformConfig = (platform: string | null) => {
    const configs: Record<string, string> = {
      Telegram: "Bot Token will be required in the next step",
      Discord: "Server connection will be configured next",
      API: "Embeddable widget code will be generated",
      Instagram: "Business account connection required",
      WhatsApp: "Business account verification needed",
    };
    return platform ? configs[platform] : null;
  };


  const createBots = async () : Promise<void>=>{
    try{
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bot/createBot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform: selectedPlatform,
          intelligenceSource :  dataSource,
          purpose : botType,
          botName : botName,
          botDescription : botDescription,
          userId : userId ,
        }),
      });
      const data = await response.json();

      if(!response.ok){
        throw new Error(data.message || 'Failed to create bot');
      }
      console.log("Bot created successfully:", data);

    }
    catch(e){
      console.log("Error creating bot:", e);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white font-outfit">
          Create a New Bot
        </h1>
        <p className="text-gray-600 dark:text-gray-400 font-inter text-base">
          Configure your bot and deploy it to your favorite platform
        </p>
      </div>

      {/* Main Form Container */}
      <div className="space-y-6">
        {/* 1. Basic Bot Info */}
        <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 rounded-xl p-6 space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 font-outfit">
              Basic Information
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
              Give your bot a name and description
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2 font-outfit">
                Bot Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={botName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBotName(e.target.value)}
                placeholder="e.g., Customer Support Bot"
                className="w-full px-4 py-2.5 bg-white dark:bg-stone-950 border border-gray-300 dark:border-stone-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-600 focus:border-transparent transition-all font-inter"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2 font-outfit">
                Bot Description <span className="text-gray-400 text-xs">(Optional But Highly recommended)</span>
              </label>
              <textarea
                value={botDescription}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBotDescription(e.target.value)}
                rows={3}
                placeholder="Describe what your bot does..."
                className="w-full px-4 py-2.5 bg-white dark:bg-stone-950 border border-gray-300 dark:border-stone-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-600 focus:border-transparent transition-all font-inter resize-none"
              />
            </div>
          </div>
        </div>

        {/* 2. Platform Selection */}
        <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 rounded-xl p-6 space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 font-outfit">
              Select Platform
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
              Choose where you want to deploy your bot
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              const isSelected = selectedPlatform === platform.id;
              
              return (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? "border-pink-500 dark:border-pink-600 bg-pink-50 dark:bg-pink-950/20"
                      : "border-gray-200 dark:border-stone-800 hover:border-gray-300 dark:hover:border-stone-700"
                  }`}
                >
                  {platform.isPaid && (
                    <span className="absolute top-2 right-2 text-[10px] font-semibold px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full">
                      Pro
                    </span>
                  )}
                  <div className={`w-12 h-12 mx-auto ${platform.bgColor} rounded-lg flex items-center justify-center mb-2`}>
                    <Icon className={`w-6 h-6 ${platform.color}`} />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white font-outfit">
                    {platform.name}
                  </p>
                  {isSelected && (
                    <MdCheckCircle className="absolute top-2 left-2 w-5 h-5 text-pink-600 dark:text-pink-400" />
                  )}
                </button>
              );
            })}
          </div>

          {selectedPlatform && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-200 font-inter">
                ℹ️ {getPlatformConfig(selectedPlatform)}
              </p>
            </div>
          )}
        </div>

        {/* 3. Bot Purpose / Type */}
        <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 rounded-xl p-6 space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 font-outfit">
              Bot Purpose
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
              What will your bot do?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {botTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = botType === type.id;

              return (
                <button
                  key={type.id}
                  onClick={() => setBotType(type.id)}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? "border-pink-500 dark:border-pink-600 bg-pink-50 dark:bg-pink-950/20"
                      : "border-gray-200 dark:border-stone-800 hover:border-gray-300 dark:hover:border-stone-700"
                  }`}
                >
                  <Icon className={`w-8 h-8 ${type.color} mb-3`} />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 font-outfit">
                    {type.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                    {type.description}
                  </p>
                  {isSelected && (
                    <MdCheckCircle className="absolute top-4 right-4 w-5 h-5 text-pink-600 dark:text-pink-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Data Source / Intelligence */}
        <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 rounded-xl p-6 space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 font-outfit">
              Intelligence Source
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
              How should your bot generate responses?
            </p>
          </div>

          <div className="space-y-3">
            {dataSources.map((source) => {
              const Icon = source.icon;
              const isSelected = dataSource === source.id;

              return (
                <button
                  key={source.id}
                  onClick={() => setDataSource(source.id)}
                  className={`w-full p-4 rounded-xl border-2 flex items-start gap-4 text-left transition-all ${
                    isSelected
                      ? "border-pink-500 dark:border-pink-600 bg-pink-50 dark:bg-pink-950/20"
                      : "border-gray-200 dark:border-stone-800 hover:border-gray-300 dark:hover:border-stone-700"
                  }`}
                >
                  <div className={`p-2 ${isSelected ? 'bg-pink-200 dark:bg-pink-900/40' : 'bg-gray-100 dark:bg-stone-800'} rounded-lg`}>
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-pink-600 dark:text-pink-400' : 'text-gray-600 dark:text-gray-400'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 font-outfit">
                      {source.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                      {source.description}
                    </p>
                  </div>
                  {isSelected && (
                    <MdCheckCircle className="w-5 h-5 text-pink-600 dark:text-pink-400 mt-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Actions */}
        <div className="flex items-center justify-between pt-4">
          <Button 
            variant="outline" 
            className="px-6 py-5 font-inter border-gray-300 dark:border-stone-700"
          >
            Cancel
          </Button>
          <Button 
          onClick={createBots}
            className="px-8 py-5 bg-pink-600 hover:bg-pink-700 text-white font-inter"
          >
            Create Bot
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateBotPage;
