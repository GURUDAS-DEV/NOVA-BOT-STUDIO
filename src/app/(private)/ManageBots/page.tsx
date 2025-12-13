"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  FaTelegram, 
  FaDiscord, 
  FaInstagram, 
  FaWhatsapp 
} from "react-icons/fa";
import { 
  MdOutlineWeb,
  MdMoreVert,
  MdPlayArrow,
  MdPause,
  MdDelete,
  MdSettings,
  MdBarChart,
  MdAdd
} from "react-icons/md";
import { BiBot } from "react-icons/bi";
import { Button } from "@/components/ui/button";

interface Bot {
  id: string;
  name: string;
  platform: "telegram" | "discord" | "website" | "instagram" | "whatsapp";
  type: "chatbot" | "search" | "automation";
  status: "active" | "paused" | "disabled";
  messages: number;
  lastUpdated: string;
}

const ManageBotsPage = () => {
  // Mock data - replace with real data from your backend
  const [bots, setBots] = useState<Bot[]>([
    {
      id: "1",
      name: "Customer Support Bot",
      platform: "telegram",
      type: "chatbot",
      status: "active",
      messages: 1243,
      lastUpdated: "2 hours ago"
    },
    {
      id: "2",
      name: "Sales Assistant",
      platform: "discord",
      type: "chatbot",
      status: "active",
      messages: 856,
      lastUpdated: "5 hours ago"
    },
    {
      id: "3",
      name: "FAQ Bot",
      platform: "website",
      type: "search",
      status: "paused",
      messages: 423,
      lastUpdated: "1 day ago"
    },
    {
      id: "4",
      name: "Product Search",
      platform: "telegram",
      type: "search",
      status: "active",
      messages: 2891,
      lastUpdated: "3 hours ago"
    },
    {
      id: "5",
      name: "Auto Responder",
      platform: "whatsapp",
      type: "automation",
      status: "disabled",
      messages: 0,
      lastUpdated: "3 days ago"
    },
  ]);

  const [showMenu, setShowMenu] = useState<string | null>(null);

  const platforms = {
    telegram: { 
      name: "Telegram", 
      icon: FaTelegram, 
      color: "text-blue-500", 
      bgColor: "bg-blue-100 dark:bg-blue-950/30",
      isPaid: false 
    },
    discord: { 
      name: "Discord", 
      icon: FaDiscord, 
      color: "text-indigo-500", 
      bgColor: "bg-indigo-100 dark:bg-indigo-950/30",
      isPaid: false 
    },
    website: { 
      name: "Website", 
      icon: MdOutlineWeb, 
      color: "text-green-500", 
      bgColor: "bg-green-100 dark:bg-green-950/30",
      isPaid: false 
    },
    instagram: { 
      name: "Instagram", 
      icon: FaInstagram, 
      color: "text-pink-500", 
      bgColor: "bg-pink-100 dark:bg-pink-950/30",
      isPaid: true 
    },
    whatsapp: { 
      name: "WhatsApp", 
      icon: FaWhatsapp, 
      color: "text-emerald-500", 
      bgColor: "bg-emerald-100 dark:bg-emerald-950/30",
      isPaid: true 
    },
  };

  const botTypeLabels = {
    chatbot: "AI Chatbot",
    search: "Search Bot",
    automation: "Automation"
  };

  const getStatusColor = (status: Bot["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "paused":
        return "bg-yellow-500";
      case "disabled":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusLabel = (status: Bot["status"]) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Empty state condition
  const hasNoBots = bots.length === 0;

  if (hasNoBots) {
    return (
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white font-outfit">
              My Bots
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-inter text-base mt-2">
              Manage, monitor, and configure your bots
            </p>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 rounded-xl">
          <div className="w-20 h-20 bg-gray-100 dark:bg-stone-800 rounded-full flex items-center justify-center mb-6">
            <BiBot className="w-10 h-10 text-gray-400 dark:text-gray-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2 font-outfit">
            No bots yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 font-inter text-center max-w-md">
            You have not created any bots yet. Get started by creating your first bot and deploying it to your favorite platform.
          </p>
          <Link href="/CreateBots">
            <Button className="px-6 py-5 bg-pink-600 hover:bg-pink-700 text-white font-inter">
              <MdAdd className="w-5 h-5 mr-2" />
              Create Your First Bot
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white font-outfit">
            My Bots
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-inter text-base mt-2">
            Manage, monitor, and configure your bots
          </p>
        </div>
        <Link href="/CreateBots">
          <Button className="px-6 py-5 bg-pink-600 hover:bg-pink-700 text-white font-inter whitespace-nowrap">
            <MdAdd className="w-5 h-5 mr-2" />
            Create New Bot
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 rounded-xl p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-inter mb-1">Total Bots</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white font-outfit">{bots.length}</p>
        </div>
        <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 rounded-xl p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-inter mb-1">Active</p>
          <p className="text-2xl font-semibold text-green-600 dark:text-green-400 font-outfit">
            {bots.filter(b => b.status === "active").length}
          </p>
        </div>
        <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 rounded-xl p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-inter mb-1">Paused</p>
          <p className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400 font-outfit">
            {bots.filter(b => b.status === "paused").length}
          </p>
        </div>
        <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 rounded-xl p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-inter mb-1">Total Messages</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white font-outfit">
            {bots.reduce((acc, bot) => acc + bot.messages, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Bot Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {bots.map((bot) => {
          const platform = platforms[bot.platform];
          const PlatformIcon = platform.icon;

          return (
            <div
              key={bot.id}
              className="bg-white cursor-pointer dark:bg-stone-900 border border-gray-200 dark:border-stone-800 rounded-xl p-6 hover:border-gray-300 dark:hover:border-stone-700 transition-all hover:shadow-lg"
            >
              {/* Bot Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-3 ${platform.bgColor} rounded-lg`}>
                    <PlatformIcon className={`w-6 h-6 ${platform.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-outfit truncate">
                      {bot.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                        {platform.name}
                      </span>
                      {platform.isPaid && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full">
                          Pro
                        </span>
                      )}
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                        {botTypeLabels[bot.type]}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-stone-800 rounded-full">
                  <span className={`w-2 h-2 rounded-full ${getStatusColor(bot.status)} ${bot.status === 'active' ? 'animate-pulse' : ''}`} />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 font-inter">
                    {getStatusLabel(bot.status)}
                  </span>
                </div>
              </div>

              {/* Bot Stats */}
              <div className="flex items-center gap-4 mb-4 py-3 border-y border-gray-200 dark:border-stone-800">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-inter">Messages</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white font-outfit">
                    {bot.messages.toLocaleString()}
                  </p>
                </div>
                <div className="w-px h-10 bg-gray-200 dark:bg-stone-800" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-inter">Last Updated</p>
                  <p className="text-sm text-gray-900 dark:text-white font-inter">
                    {bot.lastUpdated}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 text-black dark:text-white font-inter border-gray-300 dark:border-stone-700"
                >
                  <MdSettings className="w-4 h-4" />
                  Configure
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 font-inter text-black dark:text-white border-gray-300 dark:border-stone-700"
                >
                  <MdBarChart className="w-4 h-4" />
                  Analytics
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 font-inter text-black dark:text-white border-gray-300 dark:border-stone-700"
                >
                  {bot.status === "active" ? (
                    <>
                      <MdPause className="w-4 h-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <MdPlayArrow className="w-4 h-4" />
                      Resume
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 text-red-600 hover:text-red-700 dark:text-red-300 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 font-inter border-gray-300 dark:border-stone-700"
                >
                  <MdDelete className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManageBotsPage;
