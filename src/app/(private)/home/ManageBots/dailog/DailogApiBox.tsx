
"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import { Check, Copy, ShieldAlert } from "lucide-react"

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

type ApiKeyDialogProps = {
  apiKey: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DailogApiBox: React.FC<ApiKeyDialogProps> = ({
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
            "fixed top-1/2 left-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gray-200/70 bg-white/95 p-6 shadow-2xl ring-1 ring-black/5 backdrop-blur-0 transition-all duration-200",
            "dark:border-stone-800/80 dark:bg-stone-800/95 dark:ring-white/5",
            "data-[state=open]:animate-in data-[state=open]:zoom-in-90 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:zoom-out-90 data-[state=closed]:fade-out-0"
          )}
        >
          <div className="flex items-start font-outfit justify-between gap-3">
            <div className="flex items-start gap-5">
              <span className="flex size-11 items-center justify-center rounded-xl border border-pink-100/70 bg-gradient-to-br from-pink-500/15 via-pink-500/8 to-blue-500/15 text-pink-600 shadow-sm dark:border-pink-900/50 dark:text-pink-200">
                <ShieldAlert className="size-5" aria-hidden="true" />
              </span>
              <div className="space-y-1.5">
                <p className="text-xs uppercase tracking-[0.14em] text-pink-600 dark:text-pink-300 font-semibold">
                  Sensitive
                </p>
                <AlertDialogTitle className="text-xl font-poppins font-semibold text-gray-900 dark:text-white">
                  Copy and store your API key
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                  This key is only shown once. Save it securely; if you lose it you will need to generate a new one.
                </AlertDialogDescription>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-stone-800 bg-gray-50/80 dark:bg-black/40 px-4 py-3 shadow-inner">
            <div className="font-outfit text-sm text-gray-900 dark:text-gray-100 break-all">
              {apiKey || "No key available"}
            </div>
          </div>

          <AlertDialogFooter className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <span className="inline-flex size-2.5 rounded-full bg-amber-400/90" aria-hidden="true" />
              Only visible right now. Store it in your password manager.
            </div>
            <div className="flex w-full gap-2 sm:w-auto">
              <Button
                variant="ghost"
                className="flex-1 sm:flex-none text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-stone-800"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
              <Button className="flex-1 sm:flex-none bg-pink-600 hover:bg-pink-700 text-white" onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check className="size-4" aria-hidden="true" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="size-4" aria-hidden="true" />
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

export default DailogApiBox