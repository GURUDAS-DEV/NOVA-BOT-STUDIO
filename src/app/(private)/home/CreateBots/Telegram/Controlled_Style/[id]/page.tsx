"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CreateTelegramControlledStylePage() {
  const params = useParams<{ id: string }>();
  const botId = params?.id || "";

  return (
    <div className="min-h-screen bg-pink-50 dark:bg-stone-950 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 rounded-xl p-8 space-y-5">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-outfit">
          Telegram Controlled Style
        </h1>
        <p className="text-gray-700 dark:text-gray-300 font-outfit">
          Controlled style flow for Telegram is now enabled in bot creation.
          You created bot id: <span className="font-semibold">{botId || "(unknown)"}</span>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-outfit">
          Next step implementation can be added here for options, menus, and structured interactions.
        </p>

        <div className="flex gap-3">
          <Link href="/home/CreateBots">
            <Button variant="outline">Back to Create Bots</Button>
          </Link>
          <Link href="/home/ManageBots">
            <Button>Go to Manage Bots</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
