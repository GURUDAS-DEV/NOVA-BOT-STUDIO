"use client";

import { FaTelegram, FaDiscord, FaTrash, FaUndo } from "react-icons/fa";
import { MdWarning } from "react-icons/md";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useState, useCallback } from "react";
import type { bot } from "@/lib/Types/getBots";
import { Spinner } from "@/components/ui/spinner";

const RecentlyDeletedPage = () => {
  const [deletedBots, setDeletedBots] = useState<bot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [recoveryDays, setRecoveryDays] = useState<{ [key: string]: number }>(
    {}
  );

  const [dailogAction, setDailogAction] = useState<boolean>(false);
  const [wantToDelete, setWantToDelete] = useState<boolean>(false);
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);

  // Fetch deleted bots
  const fetchDeletedBots = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bot/getDeletedBots`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setDeletedBots(data.deletedBots || []);
        // Calculate days remaining for each bot
        calculateDaysRemaining(data.deletedBots || []);
      }
    } catch (error) {
      console.error("Error fetching deleted bots:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate days remaining for permanent deletion (30 days from deletion)
  const calculateDaysRemaining = (bots: bot[]): void => {
    const daysMap: { [key: string]: number } = {};
    bots.forEach((bot) => {
      const deletionDate = new Date(bot.deleted_at!);
      const permanentDeletionDate = new Date(
        deletionDate.getTime() + 30 * 24 * 60 * 60 * 1000
      );
      const today = new Date();
      const daysLeft = Math.ceil(
        (permanentDeletionDate.getTime() - today.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      daysMap[bot._id] = Math.max(0, daysLeft);
    });
    setRecoveryDays(daysMap);
  };

  // Recover a bot
  const handleRecover = async (botId: string): Promise<void> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bot/recoverBot`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ botId }),
        }
      );
      const data = await response.json();
      console.log("Error recovering bot:", data);

      if (response.ok) {
        setDeletedBots(deletedBots.filter((bot) => bot._id !== botId));
        setDailogAction(false);
      }
    } catch (error) {
      console.error("Error recovering bot:", error);
    }
  };

  // Permanently delete a bot
  const handlePermanentDelete = async (botId: string): Promise<void> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bot/permanentlyDeleteBot`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ botId }),
        }
      );
      const data = await response.json();
      console.log("permanently deleting bot:", data);

      if (response.ok) {
        // Remove from deleted list
        setDeletedBots(deletedBots.filter((bot) => bot._id !== botId));
        setDailogAction(false);
      }
    } catch (error) {
      console.error("Error permanently deleting bot:", error);
    }
  };

  // Open recover dialog
  const openRecoverDialog = (botId: string) => {
    setSelectedBotId(botId);
    setWantToDelete(false);
    setDailogAction(true);
  };

  // Open delete dialog
  const openDeleteDialog = (botId: string) => {
    setSelectedBotId(botId);
    setWantToDelete(true);
    setDailogAction(true);
  };

  // Get selected bot name
  const getSelectedBotName = (): string => {
    const bot = deletedBots.find((b) => b._id === selectedBotId);
    return bot?.botName || "Bot";
  };

  useEffect(() => {
    fetchDeletedBots();
  }, [fetchDeletedBots]);

  useEffect(() => {
    // Refresh days remaining every hour
    const interval = setInterval(() => {
      calculateDaysRemaining(deletedBots);
    }, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [deletedBots]);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <Button variant="ghost" size="lg" disabled>
          <Spinner className="mr-2 h-8 w-8 dark:text-white" />
          <p className="text-black dark:text-white">Loading...</p>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl overflow-hidden mx-auto space-y-8">
      {/* Alert Dialog for Recover/Delete */}
      <AlertDialog open={dailogAction} onOpenChange={setDailogAction}>
        <AlertDialogContent className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 shadow-lg">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`p-2 rounded-lg ${
                  wantToDelete
                    ? "bg-red-100 dark:bg-red-900/40"
                    : "bg-blue-100 dark:bg-blue-900/40"
                }`}
              >
                {wantToDelete ? (
                  <FaTrash className="w-5 h-5 text-red-600 dark:text-red-400" />
                ) : (
                  <FaUndo className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                )}
              </div>
            </div>
            <AlertDialogTitle className="text-lg font-semibold text-gray-900 dark:text-white font-outfit">
              {wantToDelete ? "Delete Permanently" : "Recover Bot"}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-400 font-inter space-y-2">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-1">
                Bot Name: {getSelectedBotName()}
              </p>
            </div>
            <div>
              {wantToDelete ? (
                <p>
                  This action cannot be undone. The bot &quot;{getSelectedBotName()}
                  &quot; and all its data will be removed permanently. Are you sure you
                  want to proceed?
                </p>
              ) : (
                <p>
                  Recover &quot;{getSelectedBotName()}&quot; to your bots list. It
                  will return to its previous state.
                </p>
              )}
            </div>
          </AlertDialogDescription>
          <div className="flex justify-end gap-3 mt-6">
            <AlertDialogCancel className="font-inter cursor-pointer transition-colors duration-150 text-black dark:text-white  hover:bg-gray-100 dark:hover:bg-stone-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedBotId) {
                  if (wantToDelete) {
                    handlePermanentDelete(selectedBotId);
                  } else {
                    handleRecover(selectedBotId);
                  }
                }
              }}
              className={`font-inter transition-all duration-150 ${
                wantToDelete
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {wantToDelete ? "Delete" : "Recover"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header */}


      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white font-outfit">
          Recently Deleted
        </h1>
        <p className="text-gray-600 dark:text-gray-400 font-inter text-base">
          Manage your deleted bots. Recover them before they are permanently
          removed.
        </p>
      </div>

      {/* Warning Alert */}
      <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-xl p-4 flex items-start gap-4">
        <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg shrink-0">
          <MdWarning className="w-5 h-5 text-red-600 dark:text-red-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-red-900 dark:text-red-300 mb-1 font-outfit">
            Automatic Deletion Notice
          </h3>
          <p className="text-sm text-red-800 dark:text-red-400 font-inter">
            All deleted bots will be permanently removed after 30 days of
            deletion. You can recover them before this period expires by
            clicking the recovery button. Once the 30-day window closes, data
            cannot be recovered.
          </p>
        </div>
      </div>

      {/* Deleted Bots List */}
      {deletedBots.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 rounded-xl p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gray-100 dark:bg-stone-800 rounded-full">
              <FaTrash className="w-6 h-6 text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 font-outfit">
            No Deleted Bots
          </h3>
          <p className="text-gray-600 dark:text-gray-400 font-inter">
            You havent deleted any bots yet. Your bots will appear here when
            you delete them.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deletedBots.map((bot) => (
            <div
              key={bot._id}
              className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 rounded-xl p-6 hover:border-gray-300 dark:hover:border-stone-700 transition-all duration-200 hover:shadow-md flex flex-col"
            >
              {/* Days Left Badge */}
              <div className="mb-4 flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white dark:bg-stone-800 rounded-lg border border-gray-200 dark:border-stone-700">
                    {bot.platform[0] === "Telegram" ? (
                      <FaTelegram className="w-5 h-5 text-blue-500" />
                    ) : (
                      <FaDiscord className="w-5 h-5 text-indigo-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white font-outfit">
                      {bot.botName}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-inter">
                      {bot.platform}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bot Info */}
              <div className="space-y-3 mb-4 flex-1">
                <div className="space-y-1">
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-inter">
                    Created: {new Date(bot.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-inter">
                    Deleted: {new Date(bot.deleted_at!).toLocaleDateString()}
                  </p>
                </div>

                {/* Days Remaining */}
                <div
                  className={`p-3 rounded-lg border ${
                    (recoveryDays[bot._id] || 0) <= 7
                      ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/50"
                      : "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800/50"
                  }`}
                >
                  <p
                    className={`text-sm font-semibold font-outfit ${
                      (recoveryDays[bot._id] || 0) <= 7
                        ? "text-red-700 dark:text-red-400"
                        : "text-yellow-700 dark:text-yellow-400"
                    }`}
                  >
                    {recoveryDays[bot._id] !== undefined
                      ? `${recoveryDays[bot._id]} days left`
                      : "Calculating..."}
                  </p>
                  <p
                    className={`text-xs font-inter ${
                      (recoveryDays[bot._id] || 0) <= 7
                        ? "text-red-600 dark:text-red-400"
                        : "text-yellow-600 dark:text-yellow-400"
                    }`}
                  >
                    until permanent deletion
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() => openRecoverDialog(bot._id)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-inter flex items-center justify-center gap-2 transition-all duration-150 ease-out hover:scale-105 active:scale-95"
                >
                  <FaUndo className="w-4 h-4" />
                  Recover
                </Button>
                <Button
                  onClick={() => openDeleteDialog(bot._id)}
                  variant="destructive"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-inter flex items-center justify-center gap-2 transition-all duration-150 ease-out hover:scale-105 active:scale-95"
                >
                  <FaTrash className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentlyDeletedPage;
