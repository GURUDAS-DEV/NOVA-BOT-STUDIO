"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MdErrorOutline,
  MdHome,
  MdArrowBack,
  MdEdit,
  MdVolumeUp,
  MdDescription,
  MdLightbulb,
  MdSmartToy,
  MdClose,
  MdCheck,
  MdAutoAwesome,
  MdAdd,
  MdLanguage,
  MdInfo,
} from "react-icons/md";
import { BiBot } from "react-icons/bi";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, Toaster } from "sonner";
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

interface QAPair {
  question: string;
  answer: string;
}

interface FormData {
  botType: string;
  tone: string;
  verbosity: string;
  websiteContext: string;
  detailedDescription: string;
  OwnerInformation: string;
  additionalInformation: string;
  examples: QAPair[];
  apiEndpoint: string;
  responseFormat: string;
  apiUsageRules: string;
}

const EditBotPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [botName, setBotName] = useState("My Website Bot");
  const [botNotFound, setBotNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [pendingEnhancedText, setPendingEnhancedText] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [tempFormData, setTempFormData] = useState<FormData | null>(null);
  const [isValidatingBehavior, setIsValidatingBehavior] = useState(false);
  const [isValidatingExamples, setIsValidatingExamples] = useState(false);
  const [includeApi, setIncludeApi] = useState(false);
  const [isApiTested, setIsApiTested] = useState(false);
  const WEBSITE_CONTEXT_OPTIONS = [
    "E-commerce",
    "Portfolio",
    "Blog",
    "SaaS",
    "Education",
    "Healthcare",
    "Real Estate",
    "Travel",
    "News/Media",
    "Customer Support",
    "Booking/Reservations",
    "Community/Forum",
    "Finance/Fintech",
    "Entertainment",
    "Personal",
    "Non-profit",
    "Restaurant/Food",
    "Agency/Services",
    "Marketplace",
    "Landing Page",
    "Other",
  ];
  const [selectedWebsiteOptions, setSelectedWebsiteOptions] = useState<string[]>([]);
  const [otherWebsiteOption, setOtherWebsiteOption] = useState<string>("");

  const [formData, setFormData] = useState<FormData>({
    botType: "Freestyle Website Bot",
    tone: "Professional",
    verbosity: "Friendly",
    websiteContext: "",
    detailedDescription: "",
    OwnerInformation: "",
    additionalInformation: "",
    examples: [{ question: "", answer: "" }],
    apiEndpoint: "",
    responseFormat: "",
    apiUsageRules: "",
  });

  const getBotConfig = async (botId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/botConfig/getConfig/${botId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setBotNotFound(true);
        return;
      }

      setBotName(data?.botConfig?.botName || "My Website Bot");
      setFormData({
        botType: data?.botConfig?.config?.botType || "Freestyle Website Bot",
        tone: data?.botConfig?.config?.tone || "Professional",
        verbosity: data?.botConfig?.config?.verbosity || "Friendly",
        websiteContext: data?.botConfig?.config?.websiteType || "",
        detailedDescription: data?.botConfig?.config?.behaviorDescription || "",
        OwnerInformation: data?.botConfig?.config?.OwnerInformation || "",
        additionalInformation:
          data?.botConfig?.config?.additionalInformation || "",
        examples: data?.botConfig?.config?.examples || [
          { question: "", answer: "" },
        ],
        apiEndpoint: data?.botConfig?.config?.apiEndpoint || "",
        responseFormat: data?.botConfig?.config?.responseFormat || "",
        apiUsageRules: data?.botConfig?.config?.apiUsageRules || "",
      });
    } catch (e) {
      console.error("Error fetching bot configuration:", e);
      setBotNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getBotConfig(id);
    }
  }, [id]);

  // helper to enhance any text block
  const enhanceAnyText = async (text: string): Promise<string | null> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/aiFeatures/EnhanceText`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      }
    );
    const data = await response.json();
    if (response.ok && data?.enhancedText) return data.enhancedText as string;
    return null;
  };

  const handleSaveChanges = async () => {
    if (formData.detailedDescription.trim().length < 100) {
      toast.error("Detailed description must be at least 100 characters.");
      return;
    }

    if (!formData.websiteContext.trim()) {
      toast.error("Website context must be set.");
      return;
    }

    try {
      setSaving(true);

      // Build the config object with proper mapping to backend schema
      const configPayload: any = {
        botType: formData.botType,
        websiteType: formData.websiteContext,
        tone: formData.tone,
        verbosity: formData.verbosity,
        behaviorDescription: formData.detailedDescription,
        OwnerInformation: formData.OwnerInformation,
        additionalInformation: formData.additionalInformation,
        examples: formData.examples,
      };

      // Only include API fields if API endpoint is configured
      if (formData.apiEndpoint.trim()) {
        configPayload.apiEndpoint = formData.apiEndpoint;
        configPayload.apiUsageRules = formData.apiUsageRules;
        configPayload.responseFormat = formData.responseFormat;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/botConfig/updateConfig`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            botId: id,
            config: configPayload,
          }),
        }
      );

      if (response.ok) {
        toast.success("Bot configuration updated successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData?.message || "Failed to update bot configuration.");
      }
    } catch (error) {
      toast.error("An error occurred while saving.");
      console.error("Error saving:", error);
    } finally {
      setSaving(false);
    }
  };

  const openEditSection = (sectionId: string) => {
    if (sectionId === "botType") return; // Locked section
    setEditingSection(sectionId);
    setTempFormData({ ...formData });
    setPendingEnhancedText(null);
    if (sectionId === "apiIntegration") {
      setIncludeApi(!!formData.apiEndpoint);
      setIsApiTested(!!formData.responseFormat);
    }
    if (sectionId === "websiteContext") {
      // Parse current string into selections and other text
      const raw = (formData.websiteContext || "").trim();
      if (!raw) {
        setSelectedWebsiteOptions([]);
        setOtherWebsiteOption("");
      } else {
        const parts = raw
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean);
        let otherVal = "";
        const normalized: string[] = [];
        for (const p of parts) {
          if (/^Other\s*:/i.test(p)) {
            otherVal = p.replace(/^Other\s*:/i, "").trim();
            normalized.push("Other");
          } else if (WEBSITE_CONTEXT_OPTIONS.includes(p)) {
            normalized.push(p);
          } else {
            // Unknown option from older saves — treat as Other
            otherVal = p;
            if (!normalized.includes("Other")) normalized.push("Other");
          }
        }
        setSelectedWebsiteOptions(Array.from(new Set(normalized)).slice(0, 5));
        setOtherWebsiteOption(otherVal);
      }
    }
  };

  const closeEditSection = () => {
    setEditingSection(null);
    setTempFormData(null);
    setPendingEnhancedText(null);
  };

  const saveSection = async () => {
    if (!tempFormData) {
      closeEditSection();
      return;
    }

    if (editingSection === "websiteContext") {
      if (selectedWebsiteOptions.length !== 5) {
        toast.error("Please select exactly 5 options for Website Context.");
        return;
      }
      if (selectedWebsiteOptions.includes("Other") && !otherWebsiteOption.trim()) {
        toast.error("Please specify the 'Other' value.");
        return;
      }
      const serialized = selectedWebsiteOptions
        .map((opt) => (opt === "Other" ? `Other: ${otherWebsiteOption.trim()}` : opt))
        .join(", ");
      const updated = { ...tempFormData, websiteContext: serialized };
      setFormData(updated);
      toast.success("Website Context updated.");
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
            body: JSON.stringify({ text, botType: tempFormData.botType } ),
          }
        );
        const raw = await response.json().catch(() => ({}));
        let parsed = {};
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
        const isValid = !!(parsed && parsed?.result === true);
        if (!isValid) {
          const reason = parsed?.reason || raw?.reason || "Description didn't pass validation.";
          toast.error(reason);
          return;
        }
        setFormData(tempFormData);
        toast.success("Description validated and saved.");
        closeEditSection();
        return;
      } catch(e) {
        console.log("Validation service error", e);
        toast.error("Validation service failed. Please try again.");
        return;
      } finally {
        setIsValidatingBehavior(false);
      }
    }

    if (editingSection === "examples") {
      try{
        setIsValidatingExamples(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/aiFeatures/ValidateExample`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ examples: tempFormData.examples, botType: tempFormData.botType }),
        });
        const data  =await response.json();
        const parsed = typeof data.message === "string" ? JSON.parse(data.message) : data.message;
        console.log("Example validation response", parsed);
      }
      catch(e){
        toast.error("Server is busy right now. Please try again later.");
        console.log("Example validation service error", e);
      }
      finally{
        setIsValidatingExamples(false);
      }
    }

    if (editingSection === "apiIntegration") {
      if (!includeApi) {
        const updated = { ...tempFormData, apiEndpoint: "", apiUsageRules: "", responseFormat: "" };
        setFormData(updated);
        setIsApiTested(false);
        toast.success("API Integration removed.");
        closeEditSection();
        return;
      }
      
      // Validate API endpoint if it's being included
      if (includeApi && tempFormData.apiEndpoint.trim()) {
        if (!isApiTested) {
          toast.error("Please test the API endpoint before saving.");
          return;
        }
        if (!tempFormData.responseFormat.trim()) {
          toast.error("API endpoint must be tested successfully with a valid response format.");
          return;
        }
      }
      
      setFormData(tempFormData);
      toast.success("API Integration updated.");
      closeEditSection();
      return;
    }

    setFormData(tempFormData);
    toast.success("Section updated successfully!");
    closeEditSection();
  };

  const updateTempField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    if (tempFormData) {
      setTempFormData({ ...tempFormData, [field]: value });
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
      id: "toneVerbosity",
      title: "Tone & Verbosity",
      description: "Communication style settings",
      icon: <MdVolumeUp className="size-6" />,
      locked: false,
      preview: `${formData.tone} • ${formData.verbosity}`,
    },
    {
      id: "websiteContext",
      title: "Website Context",
      description: "Information about your website",
      icon: <MdLanguage className="size-6" />,
      locked: false,
      preview: formData.websiteContext || "Not set",
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
    {
      id: "apiIntegration",
      title: "API Integration",
      description: "External API configuration",
      icon: <MdSmartToy className="size-6" />,
      locked: false,
      preview: formData.apiEndpoint || "Not configured",
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
            The bot you&apos;re trying to edit doesn&apos;t exist or may have been
            deleted. Please check the bot ID and try again.
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

          <div className="mt-12 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
            <p className="text-sm text-blue-800 dark:text-blue-300 font-outfit">
              <strong>Need help?</strong> If you believe this is an error,
              please contact support or check your recent activity.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 dark:bg-stone-950 py-8 px-4">
      <Toaster position="top-right" richColors />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
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
            {botName} • Freestyle Website Bot
          </p>
        </div>

        {/* Edit Modal Overlay */}
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
                {/* Tone & Verbosity Section */}
                {editingSection === "toneVerbosity" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-900 dark:text-white font-outfit">
                        Tone
                      </label>
                      <Select value={tempFormData.tone} onValueChange={(value) => updateTempField("tone", value)}>
                        <SelectTrigger className="dark:bg-black bg-white dark:text-white text-black font-outfit">
                          <SelectValue placeholder="Select a tone" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-black bg-white">
                          <SelectItem value="Professional" className="dark:text-white text-black dark:hover:bg-gray-900 hover:bg-pink-50 dark:hover:text-white hover:text-black focus:dark:bg-gray-900 focus:bg-pink-50">Professional</SelectItem>
                          <SelectItem value="Friendly" className="dark:text-white text-black dark:hover:bg-gray-900 hover:bg-pink-50 dark:hover:text-white hover:text-black focus:dark:bg-gray-900 focus:bg-pink-50">Friendly</SelectItem>
                          <SelectItem value="Casual" className="dark:text-white text-black dark:hover:bg-gray-900 hover:bg-pink-50 dark:hover:text-white hover:text-black focus:dark:bg-gray-900 focus:bg-pink-50">Casual</SelectItem>
                          <SelectItem value="Formal" className="dark:text-white text-black dark:hover:bg-gray-900 hover:bg-pink-50 dark:hover:text-white hover:text-black focus:dark:bg-gray-900 focus:bg-pink-50">Formal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-900 dark:text-white font-outfit">
                        Verbosity
                      </label>
                      <Select value={tempFormData.verbosity} onValueChange={(value) => updateTempField("verbosity", value)}>
                        <SelectTrigger className="dark:bg-black bg-white dark:text-white text-black font-outfit">
                          <SelectValue placeholder="Select verbosity level" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-black bg-white">
                          <SelectItem value="Concise" className="dark:text-white text-black dark:hover:bg-gray-900 hover:bg-pink-50 dark:hover:text-white hover:text-black focus:dark:bg-gray-900 focus:bg-pink-50">Concise - Short and to the point</SelectItem>
                          <SelectItem value="Balanced" className="dark:text-white text-black dark:hover:bg-gray-900 hover:bg-pink-50 dark:hover:text-white hover:text-black focus:dark:bg-gray-900 focus:bg-pink-50">Balanced - Moderate detail</SelectItem>
                          <SelectItem value="Detailed" className="dark:text-white text-black dark:hover:bg-gray-900 hover:bg-pink-50 dark:hover:text-white hover:text-black focus:dark:bg-gray-900 focus:bg-pink-50">Detailed - Comprehensive responses</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {/* Website Context Section */}
                {editingSection === "websiteContext" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-900 dark:text-white font-outfit">
                        Website Context (select exactly 5)
                      </label>
                      <span className={`text-xs font-semibold ${
                        selectedWebsiteOptions.length === 5
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}>
                        {selectedWebsiteOptions.length}/5 selected
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {WEBSITE_CONTEXT_OPTIONS.map((opt) => {
                        const active = selectedWebsiteOptions.includes(opt);
                        const maxed = !active && selectedWebsiteOptions.length >= 5;
                        return (
                          <Button
                            key={opt}
                            type="button"
                            variant={active ? "default" : "outline"}
                            onClick={() => {
                              setSelectedWebsiteOptions((prev) => {
                                if (prev.includes(opt)) {
                                  return prev.filter((o) => o !== opt);
                                }
                                if (prev.length >= 5) {
                                  toast.error("You can only select 5 options.");
                                  return prev;
                                }
                                return [...prev, opt];
                              });
                            }}
                            disabled={maxed}
                            className={`${
                              active
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "dark:bg-black bg-white dark:text-white text-black"
                            } border-gray-300 dark:border-stone-700 justify-start`}
                          >
                            {opt}
                          </Button>
                        );
                      })}
                    </div>

                    {selectedWebsiteOptions.includes("Other") && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900 dark:text-white font-outfit">
                          Specify Other
                        </label>
                        <Input
                          placeholder="Describe your specific context..."
                          value={otherWebsiteOption}
                          onChange={(e) => setOtherWebsiteOption(e.target.value)}
                          className="dark:bg-black bg-white dark:text-white text-black font-outfit"
                        />
                      </div>
                    )}

                    <p className="text-xs text-gray-600 dark:text-gray-400 font-outfit">
                      Tip: Choose the 5 categories that best describe your website. Use &quot;Other&quot; if none fit.
                    </p>
                  </div>
                )}

                {/* Detailed Description Section */}
                {editingSection === "detailedDescription" && (
                  <div className="relative space-y-2">
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
                    <div className="relative">
                      <Textarea
                        placeholder="Describe about service that your website or application provides or how does your bot behaves when interacting with users..."
                        value={tempFormData.detailedDescription}
                        onChange={(e) =>
                          updateTempField("detailedDescription", e.target.value)
                        }
                        className="min-h-[150px] pr-12 dark:bg-black bg-white dark:text-white text-black font-outfit rounded-lg border border-gray-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50"
                      />
                      {isEnhancing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50 rounded">
                          <Spinner className="h-6 w-6" />
                        </div>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={async () => {
                          if (tempFormData.detailedDescription.trim().length <= 100) {
                            toast.error("Please enter at least 100 characters to enhance.");
                            return;
                          }
                          try {
                            setIsEnhancing(true);
                            const enhanced = await enhanceAnyText(tempFormData.detailedDescription);
                            if (enhanced) {
                              setPendingEnhancedText(enhanced);
                              toast.success("Enhanced text ready!");
                            } else {
                              toast.error("Failed to enhance.");
                            }
                          } catch {
                            toast.error("Enhancement failed.");
                          } finally {
                            setIsEnhancing(false);
                          }
                        }}
                        disabled={isEnhancing}
                        className="absolute right-2 top-2 bg-white/80 dark:bg-stone-900 border-gray-300 dark:border-stone-700"
                      >
                        <MdAutoAwesome className="h-4 w-4" />
                      </Button>
                    </div>
                    {pendingEnhancedText && (
                      <div className="rounded-md border border-gray-200 dark:border-stone-700 bg-gray-50 dark:bg-stone-900/70 p-3 space-y-2">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white font-outfit">
                          Enhanced Text:
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-outfit">
                          {pendingEnhancedText}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              updateTempField("detailedDescription", pendingEnhancedText);
                              setPendingEnhancedText(null);
                              toast.success("Enhanced text applied.");
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setPendingEnhancedText(null);
                              toast.info("Keeping original text.");
                            }}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Information Section */}
                {editingSection === "information" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-900 dark:text-white font-outfit">
                        Information to Provide by Bot
                      </label>
                      <Textarea
                        placeholder="List information that bot can provide, E.g : Contact Details, Website Link etc."
                        value={tempFormData.OwnerInformation}
                        onChange={(e) =>
                          updateTempField("OwnerInformation", e.target.value)
                        }
                        className="min-h-[120px] dark:bg-black bg-white dark:text-white text-black font-outfit rounded-lg border border-gray-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-900 dark:text-white font-outfit">
                        Additional Information
                      </label>
                      <Textarea
                        placeholder="List Additional Information that bot should return when user ask about anything related to your service"
                        value={tempFormData.additionalInformation}
                        onChange={(e) =>
                          updateTempField("additionalInformation", e.target.value)
                        }
                        className="min-h-[120px] dark:bg-black bg-white dark:text-white text-black font-outfit rounded-lg border border-gray-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50"
                      />
                    </div>
                  </>
                )}

                {/* Examples Section */}
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
                              className="text-xs"
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
                      onClick={() => {
                        updateTempField("examples", [
                          ...tempFormData.examples,
                          { question: "", answer: "" },
                        ]);
                      }}
                      variant="outline"
                      className="w-full dark:bg-black bg-white dark:text-white text-black font-outfit"
                    >
                      <MdAdd className="h-4 w-4 mr-2" />
                      Add Example
                    </Button>
                  </div>
                )}

                {/* API Integration Section */}
                {editingSection === "apiIntegration" && (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                        <input
                          type="checkbox"
                          checked={includeApi}
                          onChange={(e) => setIncludeApi(e.target.checked)}
                          className="w-5 h-5 cursor-pointer accent-blue-600 dark:accent-blue-400"
                        />
                        <label className="text-sm font-medium text-gray-900 dark:text-white font-outfit cursor-pointer flex-1">
                          Include API Integration
                        </label>
                      </div>

                      {includeApi && (
                        <div className="space-y-4 pt-2">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900 dark:text-white font-outfit">
                              API Endpoint
                            </label>
                            <Input
                              placeholder="https://api.example.com/endpoint"
                              value={tempFormData.apiEndpoint}
                              onChange={(e) => {
                                updateTempField("apiEndpoint", e.target.value);
                                setIsApiTested(false);
                              }}
                              className="dark:bg-black bg-white dark:text-white text-black font-outfit"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900 dark:text-white font-outfit">
                              API Usage Rules
                            </label>
                            <Textarea
                              placeholder="Specify how to use this API..."
                              value={tempFormData.apiUsageRules}
                              onChange={(e) => updateTempField("apiUsageRules", e.target.value)}
                              className="min-h-[120px] dark:bg-black bg-white dark:text-white text-black font-outfit rounded-lg border border-gray-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900 dark:text-white font-outfit">
                              Response Format
                            </label>
                            <Textarea
                              disabled
                              value={tempFormData.responseFormat}
                              className="min-h-[100px] text-xs dark:bg-black bg-gray-100 dark:text-white text-gray-600 cursor-not-allowed font-outfit"
                            />
                          </div>
                          {tempFormData.apiEndpoint && (
                            <Button
                              onClick={async () => {
                                if (
                                  tempFormData.apiEndpoint.includes("localhost") ||
                                  tempFormData.apiEndpoint.startsWith("file://")
                                ) {
                                  toast.error("Localhost or file:// endpoints are not accessible.");
                                  return;
                                }
                                try {
                                  setIsTestingApi(true);
                                  const response = await fetch(
                                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/botConfig/testUserGivenApi`,
                                    {
                                      method: "POST",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ apiEndpoint: tempFormData.apiEndpoint }),
                                    }
                                  );
                                  const data = await response.json();
                                  if (!response.ok) {
                                    toast.error("API Test Failed!");
                                    setIsApiTested(false);
                                    return;
                                  }
                                  updateTempField("responseFormat", JSON.stringify(data, null, 2));
                                  setIsApiTested(true);
                                  toast.success("API Test Succeeded!");
                                } catch {
                                  toast.error("API test failed.");
                                  setIsApiTested(false);
                                } finally {
                                  setIsTestingApi(false);
                                }
                              }}
                              disabled={isTestingApi}
                              className={`w-full font-outfit ${
                                isApiTested
                                  ? "bg-green-600 hover:bg-green-700"
                                  : "bg-purple-600 hover:bg-purple-700"
                              } text-white`}
                            >
                              {isTestingApi ? (
                                <>
                                  <Spinner className="mr-2 h-4 w-4" />
                                  Testing API...
                                </>
                              ) : isApiTested ? (
                                <>
                                  <MdCheck className="mr-2 h-4 w-4" />
                                  API Tested Successfully
                                </>
                              ) : (
                                "Test API Connection"
                              )}
                            </Button>
                          )}
                        </div>
                      )}

                      {!includeApi && (
                        <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
                          <p className="text-sm text-amber-800 dark:text-amber-300 font-outfit">
                            API Integration is disabled. All API-related fields will be cleared when you save.
                          </p>
                        </div>
                      )}
                    </div>
                  </>
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
                <Button onClick={saveSection} disabled={isValidatingBehavior || isValidatingExamples} className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-80">
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

        {/* Section Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sections.map((section) => (
            <div
              key={section.id}
              onClick={() => openEditSection(section.id)}
              className={`group relative rounded-xl p-6 border-2 transition-all duration-200 ${
                section.locked
                  ? "bg-gray-50 dark:bg-stone-900 border-gray-300 dark:border-stone-800 cursor-not-allowed opacity-75"
                  : "bg-white dark:bg-stone-900 border-gray-200 dark:border-stone-800 hover:border-blue-500 dark:hover:border-blue-600 cursor-pointer hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-600/10"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-lg transition-colors ${
                    section.locked
                      ? "bg-gray-200 dark:bg-stone-800 text-gray-500 dark:text-gray-600"
                      : "bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/40"
                  }`}
                >
                  {section.icon}
                </div>
                {!section.locked && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MdEdit className="size-5 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
                {section.locked && (
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

        {/* Bottom Save All Button */}
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

export default EditBotPage;
