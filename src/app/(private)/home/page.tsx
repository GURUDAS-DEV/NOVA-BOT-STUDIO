
"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/Store/store";
import { 
  MdAdd, 
  MdTrendingUp,
  MdCheckCircle,
  MdRadioButtonUnchecked 
} from "react-icons/md";
import { 
  FaRobot, 
  FaTelegram, 
  FaDiscord,
  FaPlay
} from "react-icons/fa";
import { BiRocket, BiLink } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import type { botInterface } from "@/lib/Types/getBots";
import { Spinner } from "@/components/ui/spinner";

const HomePage = () => {
  const { username } = useAuthStore();
  const [noOfBot, setNoOfBot] = useState<number>(0);
  const [noOfActiveBot, setNoOfActiveBot] = useState<number>(0);
  const [recentBots, setRecentBots] = useState<botInterface["activeBots"]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Mock data - replace with real data from your backend
  const stats = {
    botsCreated: noOfBot,
    activeBots: noOfActiveBot,
    totalMessages: "2.4k",
    uptime: "99.9%"
  };

  // const recentBots = [
  //   { id: 1, name: "Customer Support Bot", platform: "Telegram", status: "active", messages: 342 },
  //   { id: 2, name: "Sales Assistant", platform: "Discord", status: "active", messages: 189 },
  //   { id: 3, name: "FAQ Bot", platform: "Telegram", status: "inactive", messages: 0 },
  // ];

  const gettingStartedSteps = [
    { id: 1, title: "Create your first bot", description: "Set up a bot in minutes", completed: false, href: "/Create" },
    { id: 2, title: "Connect a platform", description: "Link Telegram, Discord, or WhatsApp", completed: false, href: "/home/integration/telegram" },
    { id: 3, title: "Configure responses", description: "Customize your bot's behavior", completed: false, href: "/home/manage" },
  ];


  const botDetails = async() : Promise<void>=>{
    try{
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bot/getBotDetailsForHomePage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await response.json();
      console.log("Bot details data:", data);
      if(response.ok){
        setNoOfBot(data.noOfBots);
        setNoOfActiveBot(data.noOfActiveBots);
        setRecentBots(data.recentBots);
      }
      
    }
    catch(error){
      console.error("Error fetching bot details:", error);
    } finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    botDetails();
  },[]);

  if(loading){
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <Button variant="ghost" size="lg" disabled>
          <Spinner className="mr-2 h-8 w-8 dark:text-white an"  />
          <p className="text-black dark:text-white">Loading...</p>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl overflow-hidden mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white font-outfit">
          Welcome back{username ? `, ${username.split(" ")[0]}` : ""}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 font-inter text-base">
          Manage your bots and monitor performance from your dashboard
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/Create">
          <div className="group cursor-pointer bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 rounded-xl p-6 hover:border-gray-300 dark:hover:border-stone-700 transition-all duration-200 hover:shadow-md">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-pink-100 dark:bg-pink-950/30 rounded-lg group-hover:bg-pink-200 dark:group-hover:bg-pink-950/50 transition-colors">
                <MdAdd className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 font-outfit">
                  Create New Bot
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                  Build and deploy a new bot in minutes
                </p>
              </div>
              <BiRocket className="w-5 h-5 text-gray-400 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors" />
            </div>
          </div>
        </Link>

        <Link href="/home/integration/telegram">
          <div className="group cursor-pointer bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 rounded-xl p-6 hover:border-gray-300 dark:hover:border-stone-700 transition-all duration-200 hover:shadow-md">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-950/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-950/50 transition-colors">
                <BiLink className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 font-outfit">
                  Connect Platform
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                  Link your bot to Telegram, Discord, or more
                </p>
              </div>
              <BiRocket className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </div>
          </div>
        </Link>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600 dark:text-gray-400 font-inter">
              Bots Created
            </span>
            <FaRobot className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-3xl font-semibold text-gray-900 dark:text-white font-outfit">
            {stats.botsCreated || 0}
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600 dark:text-gray-400 font-inter">
              Active Bots
            </span>
            <FaPlay className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-3xl font-semibold text-gray-900 dark:text-white font-outfit">
            {stats.activeBots || 0}
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600 dark:text-gray-400 font-inter">
              Total Messages
            </span>
            <MdTrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-3xl font-semibold text-gray-900 dark:text-white font-outfit">
            {stats.totalMessages}
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600 dark:text-gray-400 font-inter">
              Uptime
            </span>
            <MdCheckCircle className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-3xl font-semibold text-gray-900 dark:text-white font-outfit">
            {stats.uptime}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bots */}
        <div className="lg:col-span-2 bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white font-outfit">
              Recent Bots
            </h2>
            <Link href="/home/manage">
              <Button variant="ghost" size="sm" className="text-sm text-gray-900 dark:text-white font-inter">
                View all
              </Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentBots.map((bot) => (
              <div 
                key={bot._id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-stone-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white dark:bg-stone-900 rounded-lg border border-gray-200 dark:border-stone-700">
                    {bot.platform == "Telegram" ? (
                      <FaTelegram className="w-5 h-5 text-blue-500" />
                    ) : (
                      <FaDiscord className="w-5 h-5 text-indigo-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white font-outfit">
                      {bot.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                      {bot.platform} • Created on {new Date(bot.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                    bot.status === "active" 
                      ? "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400" 
                      : "bg-gray-100 dark:bg-stone-700 text-gray-600 dark:text-gray-400"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      bot.status === "active" ? "bg-green-500" : "bg-gray-400"
                    }`} />
                    {bot.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 font-outfit">
            Getting Started
          </h2>
          
          <div className="space-y-4">
            {gettingStartedSteps.map((step) => (
              <Link key={step.id} href={step.href}>
                <div className="group cursor-pointer p-4 bg-gray-50 dark:bg-stone-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-stone-800 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {step.completed ? (
                        <MdCheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <MdRadioButtonUnchecked className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1 font-outfit text-sm">
                        {step.title}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-inter">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-stone-800">
            <Link href="/home/manage">
              <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-inter">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
