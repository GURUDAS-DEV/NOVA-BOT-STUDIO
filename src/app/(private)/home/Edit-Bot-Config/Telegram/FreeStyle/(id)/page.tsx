
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast, Toaster } from "sonner";
import {
  MdArrowBack,
  MdCheck,
  MdClose,
  MdDescription,
  MdEdit,
  MdErrorOutline,
  MdHome,
  MdInfo,
  MdKey,
  MdLightbulb,
  MdMenuBook,
  MdSecurity,
  MdVolumeUp,
} from "react-icons/md";
import { BiBot } from "react-icons/bi";

interface QAPair {
  question: string;
  answer: string;
}

type TokenStatus = "notTested" | "running" | "valid" | "invalid";

interface FormData {
  botType: string;
  tone: string;
  verbosity: string;
  botFatherGuideRead: boolean;
  telegramBotToken: string;
  tokenStatus: TokenStatus;
  tokenValidationMessage: string;
  detailedDescription: string;
  OwnerInformation: string;
  additionalInformation: string;
  examples: QAPair[];
}

interface ConfigPayload {
  botType: string;
  tone: string;
  verbosity: string;
  behaviorDescription: string;
  OwnerInformation: string;
  additionalInformation: string;
  examples: QAPair[];
  telegramBotToken: string;
  tokenStatus: TokenStatus;
}

interface ParsedData {
  result?: boolean;
  reason?: string;
}

const BOTFATHER_STEPS = [
  "Open Telegram and search for @BotFather.",
  "Start chat and send /newbot.",
  "Enter a display name for your bot.",
  "Enter a unique username ending with 'bot' (example: nova_help_bot).",
  "Copy the generated HTTP API token and paste it here.",
  "Never share your token publicly. Treat it like a password.",
];

const TOKEN_FORMAT_REGEX = /^\d{6,12}:[A-Za-z0-9_-]{20,}$/;

const EditTelegramBotPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [botName, setBotName] = useState("My Telegram Bot");
  const [botNotFound, setBotNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [tempFormData, setTempFormData] = useState<FormData | null>(null);
  const [isValidatingBehavior, setIsValidatingBehavior] = useState(false);
  const [isValidatingExamples, setIsValidatingExamples] = useState(false);
  const [isTestingToken, setIsTestingToken] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    botType: "Freestyle Telegram Bot",
    tone: "Professional",
    verbosity: "Balanced",
    botFatherGuideRead: false,
    telegramBotToken: "",
    tokenStatus: "notTested",
    tokenValidationMessage: "",
    detailedDescription: "",
    OwnerInformation: "",
    additionalInformation: "",
    examples: [{ question: "", answer: "" }],
  });

  const maskedTokenPreview = useMemo(() => {
    const token = formData.telegramBotToken.trim();
    if (!token) return "Not configured";
    if (token.length <= 10) return "Configured";
    return `${token.slice(0, 6)}...${token.slice(-4)}`;
  }, [formData.telegramBotToken]);

  const getBotConfig = async (botId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/botConfig/getConfig/${botId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setBotNotFound(true);
        return;
      }

      const existingToken =
        data?.config?.config?.telegramBotToken ||
        data?.config?.config?.botToken ||
        data?.config?.config?.telegramToken ||
        "";

      const rawTokenStatus = String(data?.config?.config?.tokenStatus || "")
        .toLowerCase()
        .trim();

      const tokenStatus: TokenStatus =
        rawTokenStatus === "valid"
          ? "valid"
          : rawTokenStatus === "invalid"
            ? "invalid"
            : rawTokenStatus === "running"
              ? "running"
              : "notTested";

      setBotName(data?.config?.botName || "My Telegram Bot");
      setFormData({
        botType: data?.config?.config?.botType || "Freestyle Telegram Bot",
        tone: data?.config?.config?.tone || "Professional",
        verbosity: data?.config?.config?.verbosity || "Balanced",
        botFatherGuideRead:
          !!existingToken || !!data?.config?.config?.botFatherGuideRead,
        telegramBotToken: existingToken,
        tokenStatus,
        tokenValidationMessage: data?.config?.config?.tokenValidationMessage || "",
        detailedDescription: data?.config?.config?.behaviorDescription || "",
        OwnerInformation: data?.config?.config?.OwnerInformation || "",
        additionalInformation: data?.config?.config?.additionalInformation || "",
        examples: data?.config?.config?.examples || [{ question: "", answer: "" }],
      });
    } catch (e) {
      console.error("Error fetching telegram bot configuration:", e);
      setBotNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) getBotConfig(id);
  }, [id]);

  const openEditSection = (sectionId: string) => {
    if (sectionId === "botType") return;
    setEditingSection(sectionId);
    setTempFormData({ ...formData });
  };

  const closeEditSection = () => {
    setEditingSection(null);
    setTempFormData(null);
  };

  const updateTempField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    if (!tempFormData) return;
    setTempFormData({ ...tempFormData, [field]: value });
  };

  const validateTokenWithBackend = async (): Promise<boolean> => {
    if (!tempFormData) return false;

    const token = tempFormData.telegramBotToken.trim();
    if (!token) {
      toast.error("Please enter Telegram bot token.");
      return false;
    }

    if (!TOKEN_FORMAT_REGEX.test(token)) {
      toast.error("Token format looks invalid. Please verify and try again.");
      return false;
    }

    try {
      setIsTestingToken(true);
      updateTempField("tokenStatus", "running");
      updateTempField("tokenValidationMessage", "");

      // Backend is source of truth for Telegram token validity.
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bot/telegram/validateToken`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ botId: id, token }),
        }
      );

      const result = await response.json().catch(() => ({}));
      const isValid =
        response.ok &&
        (result?.result === true || result?.valid === true || result?.status === "valid");

      if (!isValid) {
        const message =
          result?.reason ||
          result?.message ||
          "Token could not be validated by backend.";
        updateTempField("tokenStatus", "invalid");
        updateTempField("tokenValidationMessage", message);
        toast.error(message);
        return false;
      }

      const successMessage = result?.message || "Token validated successfully.";
      updateTempField("tokenStatus", "valid");
      updateTempField("tokenValidationMessage", successMessage);
      toast.success("Telegram bot token validated.");
      return true;
    } catch (e) {
      console.error("Token validation error:", e);
      updateTempField("tokenStatus", "invalid");
      updateTempField(
        "tokenValidationMessage",
        "Validation service is unavailable right now. Please try again."
      );
      toast.error("Unable to validate token right now.");
      return false;
    } finally {
      setIsTestingToken(false);
    }
  };

  const saveSection = async () => {
    if (!tempFormData) {
      closeEditSection();
      return;
    }

    if (editingSection === "botFatherGuide") {
      if (!tempFormData.botFatherGuideRead) {
        toast.error("Please confirm you understood BotFather setup steps.");
        return;
      }
      setFormData(tempFormData);
      toast.success("BotFather setup acknowledgement saved.");
      closeEditSection();
      return;
    }

    if (editingSection === "telegramCredentials") {
      const token = tempFormData.telegramBotToken.trim();
      if (!token) {
        toast.error("Telegram bot token is required.");
        return;
      }
      if (!TOKEN_FORMAT_REGEX.test(token)) {
        toast.error("Token format looks incorrect.");
        return;
      }
      if (tempFormData.tokenStatus !== "valid") {
        toast.error("Please validate your Telegram bot token before saving this section.");
        return;
      }

      setFormData({ ...tempFormData, telegramBotToken: token });
      toast.success("Telegram bot token section saved.");
      closeEditSection();
      return;
    }

    if (editingSection === "detailedDescription") {
      const text = tempFormData.detailedDescription?.trim() || "";
      if (text.length < 100) {
        toast.error("Detailed description must be at least 100 characters.");
        return;
      }
      try {
        setIsValidatingBehavior(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/aiFeatures/ValidateText`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, botType: tempFormData.botType }),
          }
        );
        const raw = await response.json().catch(() => ({}));
        let parsed: ParsedData = {};
        if (raw && typeof raw.validationResult !== "undefined") {
          if (typeof raw.validationResult === "string") {
            try {
              parsed = JSON.parse(raw.validationResult);
            } catch {
              parsed = {};
            }
          } else {
            parsed = raw.validationResult;
          }
        } else {
          parsed = raw;
        }

        const isValid = !!(parsed && parsed.result === true);
        if (!isValid) {
          const reason = parsed?.reason || raw?.reason || "Description did not pass validation.";
          toast.error(reason);
          return;
        }

        setFormData(tempFormData);
        toast.success("Description validated and saved.");
        closeEditSection();
        return;
      } catch (e) {
        console.log("Validation service error", e);
        toast.error("Validation service failed. Please try again.");
        return;
      } finally {
        setIsValidatingBehavior(false);
      }
    }

    if (editingSection === "examples") {
      try {
        setIsValidatingExamples(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/aiFeatures/ValidateExample`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ examples: tempFormData.examples, botType: tempFormData.botType }),
          }
        );
        const data = await response.json().catch(() => ({}));
        const parsed =
          typeof data?.message === "string" ? JSON.parse(data.message) : data?.message;
        if (response.ok && parsed?.result !== false) {
          setFormData(tempFormData);
          toast.success("Examples validated and saved.");
          closeEditSection();
          return;
        }
        toast.error(parsed?.reason || data?.message || "Failed to validate examples.");
        return;
      } catch (e) {
        toast.error("Server is busy right now. Please try again later.");
        console.log("Example validation service error", e);
        return;
      } finally {
        setIsValidatingExamples(false);
      }
    }

    setFormData(tempFormData);
    toast.success("Section updated successfully!");
    closeEditSection();
  };

  const handleSaveChanges = async () => {
    if (!formData.botFatherGuideRead) {
      toast.error("Please read and confirm BotFather setup steps first.");
      return;
    }

    if (!formData.telegramBotToken.trim()) {
      toast.error("Telegram bot token is required.");
      return;
    }

    if (formData.tokenStatus !== "valid") {
      toast.error("Please validate Telegram bot token before saving all changes.");
      return;
    }

    if (formData.detailedDescription.trim().length < 100) {
      toast.error("Detailed description must be at least 100 characters.");
      return;
    }

    try {
      setSaving(true);
      const configPayload: ConfigPayload = {
        botType: formData.botType,
        tone: formData.tone,
        verbosity: formData.verbosity,
        behaviorDescription: formData.detailedDescription,
        OwnerInformation: formData.OwnerInformation,
        additionalInformation: formData.additionalInformation,
        examples: formData.examples,
        telegramBotToken: formData.telegramBotToken.trim(),
        tokenStatus: formData.tokenStatus,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/botConfig/updateConfig`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            botId: id,
            config: configPayload,
          }),
        }
      );

      if (response.ok) {
        toast.success("Telegram bot configuration updated successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData?.message || "Failed to update bot configuration.");
      }
    } catch (error) {
      toast.error("An error occurred while saving.");
      console.error("Error saving telegram config:", error);
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    {
      id: "botType",
      title: "Bot Type",
      description: "Type of bot (locked)",
      icon: <BiBot className="size-6" />,
      locked: true,
      preview: formData.botType,
    },
    {
      id: "botFatherGuide",
      title: "BotFather Setup Guide",
      description: "Step-by-step guide to create your Telegram bot token",
      icon: <MdMenuBook className="size-6" />,
      locked: false,
      preview: formData.botFatherGuideRead ? "Read and confirmed" : "Not confirmed",
    },
    {
      id: "telegramCredentials",
      title: "Bot Token Validation",
      description: "Validate Telegram bot token through backend",
      icon: <MdSecurity className="size-6" />,
      locked: false,
      preview:
        formData.tokenStatus === "valid"
          ? `Validated (${maskedTokenPreview})`
          : formData.tokenStatus === "invalid"
            ? "Invalid token"
            : formData.tokenStatus === "running"
              ? "Validation in progress"
              : maskedTokenPreview,
    },
    {
      id: "toneVerbosity",
      title: "Tone & Verbosity",
      description: "Communication style settings",
      icon: <MdVolumeUp className="size-6" />,
      locked: false,
      preview: `${formData.tone} - ${formData.verbosity}`,
    },
    {
      id: "detailedDescription",
      title: "Detailed Description",
      description: "Bot behavior and service details",
      icon: <MdDescription className="size-6" />,
      locked: false,
      preview: formData.detailedDescription || "Not set",
    },
    {
      id: "information",
      title: "Information Fields",
      description: "Owner and additional information",
      icon: <MdInfo className="size-6" />,
      locked: false,
      preview: formData.OwnerInformation || "Not set",
    },
    {
      id: "examples",
      title: "Training Examples",
      description: "Q&A pairs for bot training",
      icon: <MdLightbulb className="size-6" />,
      locked: false,
      preview: `${formData.examples.length} example(s)`,
    },
  ];

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-pink-50 dark:bg-stone-950">
        <Button variant="ghost" disabled>
          <Spinner className="mr-2" />
          <span className="text-black dark:text-white">Loading...</span>
        </Button>
      </div>
    );
  }

  if (botNotFound) {
    return (
      <div className="min-h-screen bg-pink-50 dark:bg-stone-950 transition-colors duration-200 flex items-center justify-center">
        <Toaster position="top-right" richColors />
        <div className="max-w-md mx-auto text-center px-6">
          <div className="mb-6 flex justify-center">
            <div className="bg-red-100 dark:bg-red-950/30 p-6 rounded-full">
              <MdErrorOutline className="size-16 text-red-600 dark:text-red-400" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 font-outfit">
            Bot Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 font-outfit text-lg">
            The bot you are trying to edit does not exist or may have been deleted.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/home/ManageBots">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 flex items-center gap-2">
                <BiBot className="size-5" />
                View All Bots
              </Button>
            </Link>
            <Link href="/home">
              <Button
                variant="outline"
                className="border-gray-300 dark:border-stone-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-stone-800 flex items-center gap-2"
              >
                <MdHome className="size-5" />
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 dark:bg-stone-950 py-8 px-4">
      <Toaster position="top-right" richColors />
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-stone-800"
          >
            <MdArrowBack className="size-5 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-outfit">
            Edit Bot Configuration
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 font-outfit">
            {botName} - Freestyle Telegram Bot
          </p>
        </div>

        <div className="mb-8 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20 p-5">
          <div className="flex items-start gap-3">
            <MdMenuBook className="size-6 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold text-blue-900 dark:text-blue-300 font-outfit">
                Start Here: Create Telegram Bot Key With BotFather
              </h2>
              <p className="text-sm mt-1 text-blue-800 dark:text-blue-200 font-outfit">
                Open the section card named "BotFather Setup Guide" first, follow all steps,
                then go to "Bot Token Validation" and test your token.
              </p>
            </div>
          </div>
        </div>

        {editingSection && tempFormData && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-stone-800">
              <div className="sticky top-0 bg-white dark:bg-stone-900 border-b border-gray-200 dark:border-stone-800 p-6 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
                      {sections.find((s) => s.id === editingSection)?.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-outfit">
                        {sections.find((s) => s.id === editingSection)?.title}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-outfit">
                        {sections.find((s) => s.id === editingSection)?.description}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeEditSection}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    <MdClose className="size-6" />
                  </Button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {editingSection === "botFatherGuide" && (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20 p-4">
                      <h3 className="text-base font-semibold text-blue-900 dark:text-blue-300 font-outfit mb-3">
                        Follow These Steps In Order
                      </h3>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-blue-900 dark:text-blue-200 font-outfit">
                        {BOTFATHER_STEPS.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20 p-4">
                      <p className="text-sm text-amber-900 dark:text-amber-200 font-outfit">
                        Security tip: do not post your token in screenshots, public chats, or code.
                      </p>
                    </div>

                    <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-stone-700 bg-white dark:bg-stone-900 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tempFormData.botFatherGuideRead}
                        onChange={(e) => updateTempField("botFatherGuideRead", e.target.checked)}
                        className="w-5 h-5 mt-0.5 cursor-pointer accent-blue-600 dark:accent-blue-400"
                      />
                      <span className="text-sm text-gray-900 dark:text-white font-outfit">
                        I have completed or understood the BotFather steps and I am ready to
                        add my bot token.
                      </span>
                    </label>
                  </div>
                )}

                {editingSection === "telegramCredentials" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-900 dark:text-white font-outfit">
                        Telegram Bot Token
                      </label>
                      <Input
                        placeholder="123456789:AAEXAMPLE_your_generated_token_here"
                        value={tempFormData.telegramBotToken}
                        onChange={(e) => {
                          updateTempField("telegramBotToken", e.target.value);
                          updateTempField("tokenStatus", "notTested");
                          updateTempField("tokenValidationMessage", "");
                        }}
                        className="dark:bg-black bg-white dark:text-white text-black font-outfit"
                      />
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-outfit">
                        Token format usually looks like numbers, then a colon, then a long string.
                      </p>
                    </div>

                    {tempFormData.tokenValidationMessage && (
                      <div
                        className={`p-3 rounded-lg border ${
                          tempFormData.tokenStatus === "valid"
                            ? "border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/20"
                            : "border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20"
                        }`}
                      >
                        <p
                          className={`text-sm font-outfit ${
                            tempFormData.tokenStatus === "valid"
                              ? "text-green-800 dark:text-green-300"
                              : "text-red-800 dark:text-red-300"
                          }`}
                        >
                          {tempFormData.tokenValidationMessage}
                        </p>
                      </div>
                    )}

                    <Button
                      onClick={validateTokenWithBackend}
                      disabled={isTestingToken || !tempFormData.telegramBotToken.trim()}
                      className={`w-full text-white font-outfit ${
                        tempFormData.tokenStatus === "valid"
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {isTestingToken ? (
                        <>
                          <Spinner className="mr-2 h-4 w-4" />
                          Validating Token...
                        </>
                      ) : tempFormData.tokenStatus === "valid" ? (
                        <>
                          <MdCheck className="mr-2 h-4 w-4" />
                          Token Validated Successfully
                        </>
                      ) : (
                        <>
                          <MdKey className="mr-2 h-4 w-4" />
                          Validate Token
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {editingSection === "toneVerbosity" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-900 dark:text-white font-outfit">
                        Tone
                      </label>
                      <Select
                        value={tempFormData.tone}
                        onValueChange={(value) => updateTempField("tone", value)}
                      >
                        <SelectTrigger className="dark:bg-black bg-white dark:text-white text-black font-outfit">
                          <SelectValue placeholder="Select a tone" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-black bg-white">
                          <SelectItem value="Professional">Professional</SelectItem>
                          <SelectItem value="Friendly">Friendly</SelectItem>
                          <SelectItem value="Casual">Casual</SelectItem>
                          <SelectItem value="Formal">Formal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-900 dark:text-white font-outfit">
                        Verbosity
                      </label>
                      <Select
                        value={tempFormData.verbosity}
                        onValueChange={(value) => updateTempField("verbosity", value)}
                      >
                        <SelectTrigger className="dark:bg-black bg-white dark:text-white text-black font-outfit">
                          <SelectValue placeholder="Select verbosity level" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-black bg-white">
                          <SelectItem value="Concise">Concise - Short and to the point</SelectItem>
                          <SelectItem value="Balanced">Balanced - Moderate detail</SelectItem>
                          <SelectItem value="Detailed">Detailed - Comprehensive responses</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {editingSection === "detailedDescription" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-900 dark:text-white font-outfit">
                        Detailed Description
                      </label>
                      <span
                        className={`text-sm font-medium ${
                          tempFormData.detailedDescription.length >= 100
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {tempFormData.detailedDescription.length}/100
                      </span>
                    </div>
                    <Textarea
                      placeholder="Describe how your Telegram bot should behave, what it should answer, and its interaction boundaries..."
                      value={tempFormData.detailedDescription}
                      onChange={(e) =>
                        updateTempField("detailedDescription", e.target.value)
                      }
                      className="min-h-[150px] dark:bg-black bg-white dark:text-white text-black font-outfit rounded-lg border border-gray-300 dark:border-stone-700"
                    />
                  </div>
                )}

                {editingSection === "information" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-900 dark:text-white font-outfit">
                        Information to Provide by Bot
                      </label>
                      <Textarea
                        placeholder="List information the bot is allowed to provide."
                        value={tempFormData.OwnerInformation}
                        onChange={(e) =>
                          updateTempField("OwnerInformation", e.target.value)
                        }
                        className="min-h-[120px] dark:bg-black bg-white dark:text-white text-black font-outfit rounded-lg border border-gray-300 dark:border-stone-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-900 dark:text-white font-outfit">
                        Additional Information
                      </label>
                      <Textarea
                        placeholder="Add additional response rules or contextual details."
                        value={tempFormData.additionalInformation}
                        onChange={(e) =>
                          updateTempField("additionalInformation", e.target.value)
                        }
                        className="min-h-[120px] dark:bg-black bg-white dark:text-white text-black font-outfit rounded-lg border border-gray-300 dark:border-stone-700"
                      />
                    </div>
                  </>
                )}

                {editingSection === "examples" && (
                  <div className="space-y-4">
                    {tempFormData.examples.map((example, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 dark:bg-stone-800 rounded-lg space-y-3 border border-gray-200 dark:border-stone-700"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 font-outfit">
                            Example {index + 1}
                          </span>
                          {tempFormData.examples.length > 1 && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                const updated = tempFormData.examples.filter((_, idx) => idx !== index);
                                updateTempField("examples", updated);
                              }}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        <Textarea
                          placeholder="Question..."
                          value={example.question}
                          onChange={(e) => {
                            const updated = tempFormData.examples.map((ex, idx) =>
                              idx === index ? { ...ex, question: e.target.value } : ex
                            );
                            updateTempField("examples", updated);
                          }}
                          className="dark:bg-black bg-white dark:text-white text-black font-outfit"
                        />
                        <Textarea
                          placeholder="Answer..."
                          value={example.answer}
                          onChange={(e) => {
                            const updated = tempFormData.examples.map((ex, idx) =>
                              idx === index ? { ...ex, answer: e.target.value } : ex
                            );
                            updateTempField("examples", updated);
                          }}
                          className="min-h-20 dark:bg-black bg-white dark:text-white text-black font-outfit"
                        />
                      </div>
                    ))}
                    <Button
                      onClick={() =>
                        updateTempField("examples", [...tempFormData.examples, { question: "", answer: "" }])
                      }
                      variant="outline"
                      className="w-full dark:bg-black bg-white dark:text-white text-black font-outfit"
                    >
                      Add Example
                    </Button>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-white dark:bg-stone-900 border-t border-gray-200 dark:border-stone-800 p-6 flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={closeEditSection}
                  className="border-gray-300 dark:border-stone-700 text-gray-700 dark:text-gray-300"
                >
                  <MdClose className="size-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={saveSection}
                  disabled={isValidatingBehavior || isValidatingExamples || isTestingToken}
                  className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-80"
                >
                  <MdCheck className="size-4 mr-2" />
                  {editingSection === "detailedDescription"
                    ? isValidatingBehavior
                      ? "Validating..."
                      : "Validate & Save"
                    : editingSection === "examples"
                      ? isValidatingExamples
                        ? "Validating..."
                        : "Validate & Save"
                      : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sections.map((section) => (
            <div
              key={section.id}
              onClick={() => openEditSection(section.id)}
              className={`group relative rounded-xl p-6 border-2 transition-all duration-200 ${
                section.locked
                  ? "bg-gray-50 dark:bg-stone-900 border-gray-300 dark:border-stone-800 cursor-not-allowed opacity-75"
                  : "bg-white dark:bg-stone-900 border-gray-200 dark:border-stone-800 hover:border-blue-500 dark:hover:border-blue-600 cursor-pointer hover:shadow-lg hover:shadow-blue-500/10"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-lg transition-colors ${
                    section.locked
                      ? "bg-gray-200 dark:bg-stone-800 text-gray-500 dark:text-gray-600"
                      : "bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {section.icon}
                </div>
                {!section.locked ? (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MdEdit className="size-5 text-blue-600 dark:text-blue-400" />
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-600 bg-gray-200 dark:bg-stone-800 px-2 py-1 rounded">
                    Locked
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 font-outfit">
                {section.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 font-outfit">
                {section.description}
              </p>

              <div className="bg-gray-50 dark:bg-stone-800 rounded-lg p-3 border border-gray-200 dark:border-stone-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-outfit font-semibold mb-1">
                  Current Value
                </p>
                <p className="text-sm text-gray-900 dark:text-white font-outfit line-clamp-2">
                  {section.preview}
                </p>
              </div>

              {!section.locked && (
                <Button
                  variant="ghost"
                  className="w-full mt-4 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 flex items-center justify-center gap-2 font-outfit"
                >
                  <MdEdit className="size-4" />
                  Edit Section
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-4 justify-end">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="border-gray-300 dark:border-stone-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-stone-800 font-outfit"
          >
            Discard Changes
          </Button>
          <Button
            onClick={handleSaveChanges}
            disabled={saving}
            className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 font-outfit"
          >
            {saving ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Saving...
              </>
            ) : (
              "Save All Changes"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditTelegramBotPage;
