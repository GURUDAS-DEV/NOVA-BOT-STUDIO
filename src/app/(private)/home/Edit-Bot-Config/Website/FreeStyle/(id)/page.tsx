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
        detailedDescription:
          data?.botConfig?.config?.behaviorDescription || "",
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

  const enhanceTextWithAI = async (): Promise<void> => {
    setPendingEnhancedText(null);
    if (formData.detailedDescription.trim().length <= 100) {
      toast.error(
        "Please enter at least 100 characters in the description to enhance."
      );
      return;
    }
    try {
      setIsEnhancing(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/aiFeatures/EnhanceText`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: formData.detailedDescription }),
        }
      );
      const data = await response.json();
      if (response.ok && data?.enhancedText) {
        setPendingEnhancedText(data.enhancedText);
        toast.success("Enhanced text ready. Accept or reject below.");
      } else {
        toast.error("Failed to enhance description. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong while enhancing. Please try again.");
      console.error("Error enhancing text:", error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const acceptEnhancedText = (): void => {
    if (!pendingEnhancedText) return;
    setFormData({ ...formData, detailedDescription: pendingEnhancedText });
    setPendingEnhancedText(null);
    toast.success("Enhanced text applied.");
  };

  const rejectEnhancedText = (): void => {
    setPendingEnhancedText(null);
    toast.info("Keeping your original text.");
  };

  const testApi = async (): Promise<void> => {
    if (
      formData.apiEndpoint.includes("localhost") ||
      formData.apiEndpoint.startsWith("file://")
    ) {
      toast.error(
        "API Test Failed! Localhost or file:// endpoints are not accessible from our servers."
      );
      return;
    }

    try {
      setIsTestingApi(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/botConfig/testUserGivenApi`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ apiEndpoint: formData.apiEndpoint }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(
          "API Test Failed! Check your Endpoint or give permission to access this API on server."
        );
        return;
      }
      setFormData({
        ...formData,
        responseFormat: data ? JSON.stringify(data, null, 2) : "",
      });
      toast.success("API Test Succeeded! Now bot can use this API.");
    } catch (error) {
      toast.error("API test failed. Please check your endpoint.");
    } finally {
      setIsTestingApi(false);
    }
  };

  const addExample = () => {
    setFormData({
      ...formData,
      examples: [...formData.examples, { question: "", answer: "" }],
    });
  };

  const removeExample = (index: number) => {
    setFormData({
      ...formData,
      examples: formData.examples.filter((_, idx) => idx !== index),
    });
  };

  const updateExample = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    const updated = formData.examples.map((ex, idx) =>
      idx === index ? { ...ex, [field]: value } : ex
    );
    setFormData({ ...formData, examples: updated });
  };

  const handleSaveChanges = async () => {
    if (formData.detailedDescription.trim().length < 100) {
      toast.error("Detailed description must be at least 100 characters.");
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/botConfig/updateConfig/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success("Bot configuration updated successfully!");
      } else {
        toast.error("Failed to update bot configuration.");
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
  };

  const closeEditSection = () => {
    setEditingSection(null);
    setTempFormData(null);
    setPendingEnhancedText(null);
  };

  const saveSection = () => {
    if (tempFormData) {
      setFormData(tempFormData);
      toast.success("Section updated successfully!");
    }
    closeEditSection();
  };

  const updateTempField = (field: keyof FormData, value: any) => {
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
          <p className="text-gray-600 dark:text-gray-400 mb-8 font-inter text-lg">
            The bot you're trying to edit doesn't exist or may have been
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
            <p className="text-sm text-blue-800 dark:text-blue-300 font-inter">
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
          <p className="text-gray-600 dark:text-gray-400 mt-2 font-inter">
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
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
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
                      <label className="text-sm font-medium text-gray-900 dark:text-white font-inter">
                        Tone
                      </label>
                      <Textarea
                        placeholder="e.g., Professional, Casual, Friendly"
                        value={tempFormData.tone}
                        onChange={(e) => updateTempField("tone", e.target.value)}
                        className="dark:bg-black bg-white dark:text-white text-black font-inter"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-900 dark:text-white font-inter">
                        Verbosity
                      </label>
                      <Textarea
                        placeholder="e.g., Brief, Detailed, Conversational"
                        value={tempFormData.verbosity}
                        onChange={(e) => updateTempField("verbosity", e.target.value)}
                        className="dark:bg-black bg-white dark:text-white text-black font-inter"
                      />
                    </div>
                  </>
                )}

                {/* Website Context Section */}
                {editingSection === "websiteContext" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-white font-inter">
                      Website Context
                    </label>
                    <Textarea
                      placeholder="Describe your website and business..."
                      value={tempFormData.websiteContext}
                      onChange={(e) => updateTempField("websiteContext", e.target.value)}
                      className="min-h-[150px] dark:bg-black bg-white dark:text-white text-black font-inter"
                    />
                  </div>
                )}

                {/* Detailed Description Section */}
                {editingSection === "detailedDescription" && (
                  <div className="relative space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-900 dark:text-white font-inter">
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
                        className="min-h-[150px] pr-12 dark:bg-black bg-white dark:text-white text-black font-inter"
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
                            const response = await fetch(
                              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/aiFeatures/EnhanceText`,
                              {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ text: tempFormData.detailedDescription }),
                              }
                            );
                            const data = await response.json();
                            if (response.ok && data?.enhancedText) {
                              setPendingEnhancedText(data.enhancedText);
                              toast.success("Enhanced text ready!");
                            } else {
                              toast.error("Failed to enhance.");
                            }
                          } catch (error) {
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
                        <p className="text-sm font-semibold text-gray-900 dark:text-white font-inter">
                          Enhanced Text:
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-inter">
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
                      <label className="text-sm font-medium text-gray-900 dark:text-white font-inter">
                        Information to Provide by Bot
                      </label>
                      <Textarea
                        placeholder="List information that bot can provide, E.g : Contact Details, Website Link etc."
                        value={tempFormData.OwnerInformation}
                        onChange={(e) =>
                          updateTempField("OwnerInformation", e.target.value)
                        }
                        className="min-h-[100px] dark:bg-black bg-white dark:text-white text-black font-inter"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-900 dark:text-white font-inter">
                        Additional Information
                      </label>
                      <Textarea
                        placeholder="List Additional Information that bot should return when user ask about anything related to your service"
                        value={tempFormData.additionalInformation}
                        onChange={(e) =>
                          updateTempField("additionalInformation", e.target.value)
                        }
                        className="min-h-[100px] dark:bg-black bg-white dark:text-white text-black font-inter"
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
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 font-inter">
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
                          className="dark:bg-black bg-white dark:text-white text-black font-inter"
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
                          className="min-h-20 dark:bg-black bg-white dark:text-white text-black font-inter"
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
                      className="w-full dark:bg-black bg-white dark:text-white text-black font-inter"
                    >
                      <MdAdd className="h-4 w-4 mr-2" />
                      Add Example
                    </Button>
                  </div>
                )}

                {/* API Integration Section */}
                {editingSection === "apiIntegration" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-900 dark:text-white font-inter">
                        API Endpoint
                      </label>
                      <Input
                        placeholder="https://api.example.com/endpoint"
                        value={tempFormData.apiEndpoint}
                        onChange={(e) => updateTempField("apiEndpoint", e.target.value)}
                        className="dark:bg-black bg-white dark:text-white text-black font-inter"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-900 dark:text-white font-inter">
                        API Usage Rules
                      </label>
                      <Textarea
                        placeholder="Specify how to use this API..."
                        value={tempFormData.apiUsageRules}
                        onChange={(e) => updateTempField("apiUsageRules", e.target.value)}
                        className="min-h-[100px] dark:bg-black bg-white dark:text-white text-black font-inter"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-900 dark:text-white font-inter">
                        Response Format
                      </label>
                      <Textarea
                        disabled
                        value={tempFormData.responseFormat}
                        className="min-h-[100px] text-xs dark:bg-black bg-gray-100 dark:text-white text-gray-600 cursor-not-allowed font-inter"
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
                              return;
                            }
                            updateTempField("responseFormat", JSON.stringify(data, null, 2));
                            toast.success("API Test Succeeded!");
                          } catch {
                            toast.error("API test failed.");
                          } finally {
                            setIsTestingApi(false);
                          }
                        }}
                        disabled={isTestingApi}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-inter"
                      >
                        {isTestingApi ? (
                          <>
                            <Spinner className="mr-2 h-4 w-4" />
                            Testing API...
                          </>
                        ) : (
                          "Test API Connection"
                        )}
                      </Button>
                    )}
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
                <Button onClick={saveSection} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <MdCheck className="size-4 mr-2" />
                  Save Changes
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
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 font-inter">
                {section.description}
              </p>

              <div className="bg-gray-50 dark:bg-stone-800 rounded-lg p-3 border border-gray-200 dark:border-stone-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-inter font-semibold mb-1">
                  Current Value
                </p>
                <p className="text-sm text-gray-900 dark:text-white font-inter line-clamp-2">
                  {section.preview}
                </p>
              </div>

              {!section.locked && (
                <Button
                  variant="ghost"
                  className="w-full mt-4 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 flex items-center justify-center gap-2 font-inter"
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
            className="border-gray-300 dark:border-stone-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-stone-800 font-inter"
          >
            Discard Changes
          </Button>
          <Button
            onClick={handleSaveChanges}
            disabled={saving}
            className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 font-inter"
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
