"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import { Check, Copy, ExternalLink, ShieldAlert } from "lucide-react"
import { FaDiscord } from "react-icons/fa"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

type DiscordDialogProps = {
  apiKey: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DailogDiscordBox: React.FC<DiscordDialogProps> = ({
  apiKey,
  open,
  onOpenChange,
}) => {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!open) setCopied(false)
  }, [open])

  const handleCopy = async () => {
    if (!apiKey) return
    try {
      await navigator.clipboard.writeText(apiKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch (error) {
      console.error("Failed to copy API key", error)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogPortal>
        <AlertDialogOverlay className="bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <AlertDialogPrimitive.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gray-200/70 bg-white/95 p-7 md:p-8 shadow-2xl ring-1 ring-black/5 backdrop-blur-0 transition-all duration-200 space-y-6",
            "dark:border-stone-800/80 dark:bg-stone-800/95 dark:ring-white/5",
            "data-[state=open]:animate-in data-[state=open]:zoom-in-90 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:zoom-out-90 data-[state=closed]:fade-out-0"
          )}
        >
          <div className="flex items-start font-outfit justify-between gap-4">
            <div className="flex items-start gap-5">
              <span className="flex size-11 items-center justify-center rounded-xl border border-indigo-100/70 bg-linear-to-br from-indigo-500/15 via-indigo-500/8 to-blue-500/15 text-indigo-600 shadow-sm dark:border-indigo-900/50 dark:text-indigo-200">
                <FaDiscord className="size-5" aria-hidden="true" />
              </span>
              <div className="space-y-1.5">
                <p className="text-xs uppercase tracking-[0.14em] text-indigo-600 dark:text-indigo-300 font-semibold">
                  Discord Integration
                </p>
                <AlertDialogTitle className="text-xl font-poppins font-semibold text-gray-900 dark:text-white">
                  Connect Your Discord Bot
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                  Your Free-Style bot is now active! Connect our particular bot to the discord using the external API below.
                </AlertDialogDescription>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-stone-800 bg-gray-50/80 dark:bg-black/40 px-5 py-4 shadow-inner space-y-3">
            <div className="font-outfit text-sm leading-relaxed text-gray-900 dark:text-gray-100">
               <strong>Step 1:</strong> Connect the Nova bot to your Discord Server via the external API integration. <br />
               <strong>Step 2:</strong> Mention the bot or use <code>/ask</code> to interact with it directly within your server. <br />
               <strong>Step 3:</strong> Save your unique API key identifier if you plan on bridging external API logic manually.
            </div>
            
            <div className="mt-4 bg-gray-200 dark:bg-stone-800 p-3 rounded-xl border border-gray-300 dark:border-stone-700 flex flex-col space-y-2">
              <span className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">External API Key</span>
              <div className="break-all font-mono text-xs text-gray-900 dark:text-gray-100">
                {apiKey || "No key available"}
              </div>
            </div>
          </div>

          <AlertDialogFooter className="flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <span className="inline-flex size-2.5 rounded-full bg-indigo-400/90" aria-hidden="true" />
              Your bot is awaiting connection.
            </div>
            <div className="flex w-full gap-2 sm:w-auto">
              <Button
                variant="ghost"
                className="flex-1 sm:flex-none text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-stone-800"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
              <Button className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check className="size-4 mr-2" aria-hidden="true" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="size-4 mr-2" aria-hidden="true" />
                    Copy key
                  </>
                )}
              </Button>
            </div>
          </AlertDialogFooter>
        </AlertDialogPrimitive.Content>
      </AlertDialogPortal>
    </AlertDialog>
  )
}

export default DailogDiscordBox
