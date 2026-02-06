"use client";


import { Suspense } from "react";
import { useRouter } from "next/navigation";
import {
  FaTelegram,
  FaDiscord,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import {
  MdOutlineWeb,
  MdKey,
  MdArrowForward,
  MdLock,
  MdVpnKey,
} from "react-icons/md";
import { BiRightArrowAlt } from "react-icons/bi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const APIKeysContent = () => {
  const router = useRouter();

  const platforms = [
    {
      id: "website",
      name: "Website",
      description: "Manage API keys for your website chatbot integration",
      icon: MdOutlineWeb,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-950/30",
      borderColor: "border-green-200 dark:border-green-900/50",
      hoverBg: "hover:bg-green-50 dark:hover:bg-green-950/50",
      href: "/home/API_Keys/Website",
      isPaid: false,
    },
    {
      id: "discord",
      name: "Discord",
      description: "Configure API keys for Discord bot integration",
      icon: FaDiscord,
      color: "text-indigo-500",
      bgColor: "bg-indigo-100 dark:bg-indigo-950/90",
      borderColor: "border-indigo-200 dark:border-indigo-900/50",
      hoverBg: "hover:bg-indigo-50 dark:hover:bg-indigo-950/50",
      href: "/home/API_Keys/discord",
      isPaid: false,
    },
    {
      id: "telegram",
      name: "Telegram",
      description: "Set up API keys for Telegram bot connection",
      icon: FaTelegram,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-950/30",
      borderColor: "border-blue-200 dark:border-blue-900/50",
      hoverBg: "hover:bg-blue-50 dark:hover:bg-blue-950/50",
      href: "/home/API_Keys/telegram",
      isPaid: false,
    },
    {
      id: "instagram",
      name: "Instagram",
      description: "Manage API keys for Instagram bot automation",
      icon: FaInstagram,
      color: "text-pink-500",
      bgColor: "bg-pink-100 dark:bg-pink-950/30",
      borderColor: "border-pink-200 dark:border-pink-900/50",
      hoverBg: "hover:bg-pink-50 dark:hover:bg-pink-950/50",
      href: "/home/API_Keys/instagram",
      isPaid: true,
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      description: "Configure API keys for WhatsApp business integration",
      icon: FaWhatsapp,
      color: "text-emerald-500",
      bgColor: "bg-emerald-100 dark:bg-emerald-950/30",
      borderColor: "border-emerald-200 dark:border-emerald-900/50",
      hoverBg: "hover:bg-emerald-50 dark:hover:bg-emerald-950/50",
      href: "/home/API_Keys/whatsapp",
      isPaid: true,
    },
  ];

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      {/* Header Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl">
            <MdKey className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white font-outfit">
              API Keys Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-inter text-base mt-1">
              Securely manage your bot API keys across different platforms
            </p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <Card className="border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <MdLock className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 font-outfit">
                Secure API Key Storage
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                Your API keys are encrypted and stored securely. Never share your keys publicly. 
                Each platform requires specific API credentials to establish the bot connection.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white font-outfit">
            Select Platform
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400 font-inter">
            {platforms.length} platforms available
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <Card
                key={platform.id}
                className={`relative overflow-hidden cursor-pointer transition-all ${platform.bgColor} duration-300 border-2 ${platform.borderColor} ${platform.hoverBg} hover:shadow-lg hover:scale-[1.02] group`}
                onClick={() => handleNavigate(platform.href)}
              >
                {platform.isPaid && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-linear-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold rounded-full">
                    Premium
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 rounded-2xl ${platform.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-8 h-8 ${platform.color}`} />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white font-outfit">
                    {platform.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 font-inter mt-2">
                    {platform.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between group-hover:bg-primary/10 transition-colors"
                  >
                    <span className="flex items-center gap-2 font-inter text-black dark:text-white">
                      <MdVpnKey className="w-4 h-4 text-black dark:text-white" />
                      Manage Keys
                    </span>
                    <BiRightArrowAlt className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>

                {/* Decorative Element */}
                <div className={`absolute bottom-0 right-0 w-32 h-32 ${platform.bgColor} rounded-tl-full opacity-20 -mr-16 -mb-16`} />
              </Card>
            );
          })}
        </div>
      </div>

      {/* Bottom Info Section */}
      <Card className="bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 font-outfit flex items-center gap-2">
                <MdKey className="w-5 h-5 text-primary" />
                Need Help?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                Learn how to obtain and configure API keys for each platform in our documentation.
              </p>
            </div>
            <Button 
              variant="outline" 
              className="font-inter group"
              onClick={() => router.push("/docs/api-keys")}
            >
              View Documentation
              <MdArrowForward className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const APIKeysPage = () => {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto space-y-4 p-6">
          <div className="h-10 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-6 w-1/2 animate-pulse rounded bg-muted" />
        </div>
      }
    >
      <APIKeysContent />
    </Suspense>
  );
};

export default APIKeysPage;