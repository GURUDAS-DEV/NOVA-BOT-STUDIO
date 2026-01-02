"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { MdClose, MdAdd, MdAutoAwesome, MdInfoOutline } from "react-icons/md";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { toast, Toaster } from "sonner";
import { useAuthStore } from "@/lib/Store/store";

// Types
type BotType =
  | "FAQ"
  | "Customer Assistant"
  | "Advisor"
  | "Comparison"
  | "Navigator"
  | "Hybrid"
  | "";
type Tone = "Professional" | "Friendly" | "Casual" | "Formal" | "";
type Verbosity = "Concise" | "Balanced" | "Detailed" | "";
type WebsiteType =
  | "E-commerce"
  | "Blog"
  | "Portfolio"
  | "Corporate"
  | "Educational"
  | "Other"
  | "";

interface QAPair {
  question: string;
  answer: string;
}

interface WizardState {
  // Step 1
  botType: BotType;

  // Step 2
  tone: Tone;
  verbosity: Verbosity;

  // Step 3
  websiteType: WebsiteType;
  otherWebsiteType: string;

  // Step 4
  behaviorDescription: string;
  OwnerInformation: string;
  additionalInformation: string;

  // Step 5
  examples: QAPair[];
  examplesValidated: boolean;
  examplesValidationError?: string;

  // Step 6
  apiEnabled: boolean;
  apiEndpoint: string;
  apiUsageRules: string;
  responseFormat: string;
  apiTestResult?: string;
  apiTestPassed?: boolean;
}

const TOTAL_STEPS = 6;

// Step 1: Bot Type Selection
const Step1BotType = ({
  value,
  onChange,
}: {
  value: BotType;
  onChange: (value: BotType) => void;
}) => {
  const botTypes: { value: BotType; label: string; description: string }[] = [
    {
      value: "FAQ",
      label: "FAQ Bot",
      description: "Answers frequently asked questions",
    },
    {
      value: "Customer Assistant",
      label: "Customer Assistant",
      description: "Helps customers with inquiries",
    },
    {
      value: "Advisor",
      label: "Advisor",
      description: "Provides expert advice and recommendations",
    },
    {
      value: "Comparison",
      label: "Comparison",
      description: "Compares products or services",
    },
    {
      value: "Navigator",
      label: "Navigator",
      description: "Guides users through your website",
    },
    {
      value: "Hybrid",
      label: "Hybrid",
      description: "Combines multiple functionalities",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          Select Bot Type
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Choose the type of bot that best fits your needs
        </p>
      </div>

      <div className="grid gap-3">
        {botTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => onChange(type.value)}
            className={`p-4 text-left border rounded-lg transition-all ${
              value === type.value
                ? "border-gray-900 dark:border-white bg-gray-100 dark:bg-stone-800"
                : "border-gray-300 dark:border-stone-700 bg-gray-50 dark:bg-stone-800/50 hover:border-gray-400 dark:hover:border-stone-600"
            }`}
          >
            <div className="font-medium text-gray-900 dark:text-white">
              {type.label}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {type.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Step 2: Bot Personality
const Step2Personality = ({
  tone,
  verbosity,
  onToneChange,
  onVerbosityChange,
}: {
  tone: Tone;
  verbosity: Verbosity;
  onToneChange: (value: Tone) => void;
  onVerbosityChange: (value: Verbosity) => void;
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          Bot Personality
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Define how your bot communicates with users
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-900 dark:text-white">
          Tone
        </label>
        <Select value={tone} onValueChange={(val) => onToneChange(val as Tone)}>
          <SelectTrigger className="dark:bg-black bg-white dark:text-white text-black font-outfit">
            <SelectValue placeholder="Select tone" />
          </SelectTrigger>
          <SelectContent className="dark:bg-black bg-white dark:text-white text-black font-outfit">
            <SelectItem value="Professional">Professional</SelectItem>
            <SelectItem value="Friendly">Friendly</SelectItem>
            <SelectItem value="Casual">Casual</SelectItem>
            <SelectItem value="Formal">Formal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-900 dark:text-white">
          Verbosity
        </label>
        <Select
          value={verbosity}
          onValueChange={(val) => onVerbosityChange(val as Verbosity)}
        >
          <SelectTrigger className="dark:bg-black bg-white dark:text-white text-black font-outfit">
            <SelectValue
              placeholder="Select verbosity"
              className="dark:bg-black bg-white dark:text-white text-black font-outfit"
            />
          </SelectTrigger>
          <SelectContent className="dark:bg-black bg-white dark:text-white text-black font-outfit">
            <SelectItem value="Concise">
              Concise - Short and to the point
            </SelectItem>
            <SelectItem value="Balanced">Balanced - Moderate detail</SelectItem>
            <SelectItem value="Detailed">
              Detailed - Comprehensive responses
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

// Step 3: Website Context
const Step3WebsiteContext = ({
  value,
  onChange,
  otherValue,
  onChangeOther,
}: {
  value: WebsiteType;
  onChange: (value: WebsiteType) => void;
  otherValue: string;
  onChangeOther: (value: string) => void;
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          Website Context
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          What type of website will this bot be used on?
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-900 dark:text-white">
          Website Type
        </label>
        <Select
          value={value}
          onValueChange={(val) => onChange(val as WebsiteType)}
        >
          <SelectTrigger className="dark:bg-black bg-white dark:text-white text-black font-outfit">
            <SelectValue placeholder="Select website type" />
          </SelectTrigger>
          <SelectContent className="dark:bg-black font-outfit bg-white dark:text-white text-black">
            <SelectItem value="E-commerce">E-commerce</SelectItem>
            <SelectItem value="Blog">Blog</SelectItem>
            <SelectItem value="Portfolio">Portfolio</SelectItem>
            <SelectItem value="Corporate">Corporate</SelectItem>
            <SelectItem value="Educational">Educational</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {value === "Other" && (
        <div className="w-full flex justify-center flex-col">
          <label
            className="font-outfit text-black dark:text-white pb-0.5 text-sm font-medium pl-1"
            htmlFor=""
          >
            Please Specify(in minimum 3 words)
          </label>
          <Input
            placeholder="Specify other website type..."
            value={otherValue}
            onChange={(e) => onChangeOther(e.target.value)}
            className="h-8 pl-2 font-outfit  w-[40%] border border-gray-200 dark:bg-black bg-white dark:text-white text-black"
          />
        </div>
      )}
    </div>
  );
};

// Step 4: Bot Behavior
const Step4Behavior = ({
  description,
  OwnerInformation,
  additionalInformation,
  onDescriptionChange,
  onOwnerInformationChange,
  onAdditionalInformationChange,
  validationError,
  isValidating,
}: {
  description: string;
  OwnerInformation: string;
  additionalInformation: string;
  onDescriptionChange: (value: string) => void;
  onOwnerInformationChange: (value: string) => void;
  onAdditionalInformationChange: (value: string) => void;
  validationError?: string;
  isValidating?: boolean;
}) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [pendingEnhancedText, setPendingEnhancedText] = useState<string | null>(
    null
  );

  const enhanceTextWithAI = async (): Promise<void> => {
    setPendingEnhancedText(null);
    if (description.trim().length <= 100) {
      toast.error(
        "Please enter atleast 100 characters in the description to enhance."
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
          body: JSON.stringify({ text: description }),
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
    onDescriptionChange(pendingEnhancedText);
    setPendingEnhancedText(null);
    toast.success("Enhanced text applied.");
  };

  const rejectEnhancedText = (): void => {
    setPendingEnhancedText(null);
    toast.info("Keeping your original text.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          Bot Behavior
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Describe about your service and bot behavior and any specific information it should provide when user ask
        </p>
      </div>

      <div className="relative space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-900 dark:text-white">
            Detailed Description{" "}
            <span className="text-gray-500 dark:text-gray-400">
              (minimum 100 characters required)
            </span>
          </label>
          <span
            className={`text-sm font-medium ${
              description.length >= 100
                ? "text-green-600 dark:text-green-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {description.length}/100
          </span>
        </div>
        <div className="relative">
          <Textarea
            placeholder="Describe about service that your website or application provides or how does your bot behaves when interacting with users..."
            value={description}
            onChange={(e) => {
              onDescriptionChange(e.target.value);
            }}
            aria-busy={isEnhancing || isValidating}
            className="min-h-[120px] dark:bg-black bg-white dark:text-white text-black pr-12"
          />
          {(isEnhancing || isValidating) && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-white/80 dark:bg-stone-950/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                <Spinner className="h-4 w-4" />
                {isValidating ? "Validating text..." : "Enhancing text..."}
              </div>
            </div>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => enhanceTextWithAI()}
          title="Enhance text with AI"
          disabled={isEnhancing || isValidating}
          className="absolute right-[2%] top-[50%] -translate-y-1/2 bg-white/80 dark:bg-stone-900 border-gray-300 dark:border-stone-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-stone-800 disabled:opacity-60"
          aria-label="Enhance description with AI"
        >
          <MdAutoAwesome className="h-4 w-4" />
        </Button>

        {validationError && (
          <div className="rounded-md border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-3">
            <div className="flex items-start gap-2">
              <div className="text-red-600 dark:text-red-400 mt-0.5">⚠</div>
              <div>
                <p className="text-sm font-semibold text-red-900 dark:text-red-200">
                  Validation Error
                </p>
                <p className="text-sm text-red-800 dark:text-red-300 mt-1">
                  {validationError}
                </p>
              </div>
            </div>
          </div>
        )}

        {pendingEnhancedText && (
          <div className="rounded-md border border-gray-200 dark:border-stone-700 bg-gray-50 dark:bg-stone-900/70 p-3 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                Review enhanced text
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  onClick={acceptEnhancedText}
                  className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={rejectEnhancedText}
                  className="border-gray-300 dark:border-stone-700 text-gray-900 dark:text-white bg-white dark:bg-stone-900 hover:bg-gray-100 dark:hover:bg-stone-800"
                >
                  Reject
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {pendingEnhancedText}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-900 dark:text-white">
          Information to Provide by Bot (e.g Contact Details, Website Link etc.)
        </label>
        <Textarea
          placeholder="List information that bot can provide, E.g : Contact Details, Website Link etc."
          value={OwnerInformation}
          onChange={(e) => onOwnerInformationChange(e.target.value)}
          className="min-h-20 dark:bg-black bg-white dark:text-white text-black"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-900 dark:text-white">
          Additional Information
        </label>
        <Textarea
          placeholder="List Additional Information that bot should return when user ask about anything related to your service"
          value={additionalInformation}
          onChange={(e) => onAdditionalInformationChange(e.target.value)}
          className="min-h-20 dark:bg-black bg-white dark:text-white text-black"
        />
      </div>
    </div>
  );
};

// Step 5: Examples
const Step5Examples = ({
  examples,
  onChange,
  isValidated,
  validationError,
  onValidate,
  isValidating,
}: {
  examples: QAPair[];
  onChange: (examples: QAPair[]) => void;
  isValidated: boolean;
  validationError?: string;
  onValidate: () => Promise<void>;
  isValidating: boolean;
}) => {
  const addExample = () => {
    onChange([...examples, { question: "", answer: "" }]);
  };

  const removeExample = (index: number) => {
    onChange(examples.filter((_, idx) => idx !== index));
  };

  const updateExample = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    onChange(
      examples.map((ex, idx) =>
        idx === index ? { ...ex, [field]: value } : ex
      )
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          Training Examples
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Provide example question-answer pairs to train your bot
          <span className="text-yellow-600 dark:text-yellow-300 font-medium">
            <br></br>Please Provide Atleast 5 Example for better working of your
            Bot!
          </span>
        </p>
      </div>

      <div className="space-y-4">
        {examples.map((example, index) => (
          <Card
            key={index}
            className="bg-gray-50 dark:bg-stone-800/50 border-gray-200 dark:border-stone-700"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center dark:text-white text-black justify-between">
                <CardTitle className="text-base dark:text-white text-black">
                  Example {index + 1}
                </CardTitle>
                {examples.length > 1 && (
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => removeExample(index)}
                  >
                    <MdClose className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  User Question
                </label>
                <Input
                  placeholder="What might a user ask?"
                  value={example.question}
                  className="dark:bg-black bg-white dark:text-white text-black"
                  onChange={(e) =>
                    updateExample(index, "question", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  Bot Answer
                </label>
                <Textarea
                  placeholder="How should the bot respond?"
                  value={example.answer}
                  onChange={(e) =>
                    updateExample(index, "answer", e.target.value)
                  }
                  className="min-h-20 dark:bg-black bg-white dark:text-white text-black"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        onClick={addExample}
        variant="outline"
        className="w-full dark:bg-black bg-white dark:text-white text-black"
      >
        <MdAdd className="h-4 w-4 mr-2 " />
        Add Example
      </Button>

      {/* Validation Section */}
      <div className="mt-6 space-y-3">
        <Button
          onClick={onValidate}
          disabled={
            isValidating ||
            examples.every((ex) => !ex.question.trim() || !ex.answer.trim())
          }
          className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
        >
          {isValidating ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Validating Examples...
            </>
          ) : isValidated ? (
            "✓ Examples Validated - Click to Revalidate"
          ) : (
            "Validate Examples"
          )}
        </Button>

        {validationError && (
          <div className="rounded-md border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-3">
            <div className="flex items-start gap-2">
              <div className="text-red-600 dark:text-red-400 mt-0.5">⚠</div>
              <div>
                <p className="text-sm font-semibold text-red-900 dark:text-red-200">
                  Validation Error
                </p>
                <p className="text-sm text-red-800 dark:text-red-300 mt-1">
                  {validationError}
                </p>
              </div>
            </div>
          </div>
        )}

        {isValidated && !validationError && (
          <div className="rounded-md border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-950/30 p-3">
            <div className="flex items-start gap-2">
              <div className="text-green-600 dark:text-green-400 mt-0.5">✓</div>
              <div>
                <p className="text-sm font-semibold text-green-900 dark:text-green-200">
                  Examples Validated Successfully
                </p>
                <p className="text-sm text-green-800 dark:text-green-300 mt-1">
                  Your examples have been validated and you can proceed to the
                  next step.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Step 6: API Integration
const Step6API = ({
  enabled,
  endpoint,
  apiUsageRules,
  responseFormat,
  onEnabledChange,
  onEndpointChange,
  onApiUsageRulesChange,
  onRunTest,
  testResult,
}: {
  enabled: boolean;
  endpoint: string;
  apiUsageRules: string;
  responseFormat: string;
  onEnabledChange: (value: boolean) => void;
  onEndpointChange: (value: string) => void;
  onApiUsageRulesChange: (value: string) => void;
  onResponseFormatChange: (value: string) => void;
  onRunTest: () => Promise<void>;
  testResult?: string;
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          API Integration
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Optionally connect an external API for dynamic responses
          <br></br>
          For safety reasons, bots can only read data from external systems
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="api-enabled"
          checked={enabled}
          onChange={(e) => onEnabledChange(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 dark:border-stone-700"
        />
        <label
          htmlFor="api-enabled"
          className="text-sm font-medium cursor-pointer text-gray-900 dark:text-white"
        >
          Enable API Integration
        </label>
      </div>

      {enabled && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              API Endpoint
            </label>
            <Input
              className="dark:bg-black bg-white dark:text-white text-black"
              placeholder="https://api.example.com/endpoint"
              value={endpoint}
              onChange={(e) => onEndpointChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              API Usage Rules
            </label>
            <Textarea
              placeholder="Specify how to use this API (e.g., For single data: /1, For query parameters: ?name=value&id=123, Authentication: Bearer token required, etc.)..."
              value={apiUsageRules}
              onChange={(e) => onApiUsageRulesChange(e.target.value)}
              className="min-h-[100px] dark:bg-black bg-white dark:text-white text-black"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              Response From Given API
            </label>
            <Textarea
              disabled={true}
              placeholder='The Response From Given API will be shown here after testing the API connection. e.g., { "data": { "id": 1, "name": "Sample" } }'
              value={responseFormat}
              className="min-h-[100px] font-outfit text-xs dark:bg-black bg-white dark:text-white text-black"
            />
          </div>

          <div className="space-y-2">
            <Button
              onClick={onRunTest}
              variant="outline"
              className="w-full dark:bg-black bg-white dark:text-white text-black"
            >
              Test API Connection
            </Button>
            {testResult && (
              <p
                className={`text-sm text-center ${
                  testResult.toLowerCase().includes("succeeded")
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {testResult.includes("Succeeded")
                  ? "API Test Succeeded!"
                  : `API Test Failed: ${testResult}`}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Info banner shown while filling the wizard fields
const InfoBanner = () => {
  return (
    <div className="rounded-md p-4 mb-4 flex items-start gap-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
      <div className="text-yellow-700 dark:text-yellow-200 mt-0.5">
        <MdInfoOutline className="h-6 w-6" />
      </div>
      <div className="text-sm text-yellow-800 dark:text-yellow-100">
        <div className="font-semibold mb-1">
          Important: Provide clear bot details
        </div>
        <div>
          Please fill out all fields carefully. The more accurate and detailed
          Information you provide, the better the bot responses and behavior
          will be. Do not include reckless, sensitive, or unnecessary
          information in these fields.
        </div>
      </div>
    </div>
  );
};

// Main Wizard Component
export default function CreateWebsiteBotWizard() {
  const searchParams = useSearchParams();
  const botId = searchParams.get("id") || "";
  const { userId } = useAuthStore();
  const [doesFound, setDoesfound] = useState<boolean>(false);
  const [botName, setBotName] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [validationError, setValidationError] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isValidatingExamples, setIsValidatingExamples] = useState(false);
  const [wizardState, setWizardState] = useState<WizardState>({
    botType: "",
    tone: "",
    verbosity: "",
    websiteType: "",
    otherWebsiteType: "",
    behaviorDescription: "",
    OwnerInformation: "",
    additionalInformation: "",
    examples: [{ question: "", answer: "" }],
    examplesValidated: false,
    examplesValidationError: "",
    apiEnabled: false,
    apiEndpoint: "",
    apiUsageRules: "",
    responseFormat: "",
    apiTestResult: "",
    apiTestPassed: false,
  });
  const [isFilledUp, setIsFilledUp] = useState<boolean>(false);
  const [alreadyFilledUp, setAlreadyFilledUp] = useState<boolean>(false);

  const fetchBotStructure = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bot/getOneBotDetails/${botId}`,
        { credentials: "include" }
      );
      if(response.status === 404){
        setDoesfound(false);
        return;
      }
      else if(response.status === 405){
        setAlreadyFilledUp(true);
        toast.warning("This bot has already been set up. If you want to make changes, please go to the Manage Bots page.");
        return;
      }

      const data = await response.json();
      if (response.ok) {
        setBotName(data?.bot?.botName || "Custom Bot");
        setDoesfound(true);
      } else {
        setDoesfound(false);
      }
    } catch (err) {
      console.error("Error fetching bot details:", err);
      setDoesfound(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBotStructure();
  }, [botId]);

  if (isFilledUp || alreadyFilledUp) {
    return (
      <div className="min-h-screen bg-pink-50 dark:bg-stone-950 py-8 px-4 flex items-center justify-center">
        <Toaster position="top-right" richColors />
        <div className="max-w-2xl w-full">
          <Card className="bg-white dark:bg-stone-900 border-gray-200 dark:border-stone-800 shadow-lg">
            <CardContent className="p-12 text-center">
              {/* Success Icon */}
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-6">
                  <svg
                    className="h-16 w-16 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Success Message */}
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
               Bot Setup Completed Successfully! 🎉
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                Your bot{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {botName}
                </span>{" "}
                is now ready to serve your customers.
              </p>

              {/* Information Cards */}
              <div className="grid gap-4 mb-8 text-left">
                <div className="rounded-lg border border-gray-200 dark:border-stone-700 bg-gray-50 dark:bg-stone-800/50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-blue-600 dark:text-blue-400 mt-0.5">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Next Steps
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Go to the Manage Bots page to activate your bot and
                        start serving your customers. You can also customize
                        additional settings and monitor bot performance.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 dark:border-stone-700 bg-gray-50 dark:bg-stone-800/50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-purple-600 dark:text-purple-400 mt-0.5">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Bot is Currently Inactive
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Your bot has been configured but is not yet active.
                        Visit the Manage page to start the bot service and make
                        it live on your website.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/home/ManageBots" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 px-8 py-6 text-base font-semibold">
                    Go to Manage Bots
                  </Button>
                </Link>
                <Link href="/home/CreateBots" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto bg-white dark:bg-stone-900 text-gray-900 dark:text-white border-gray-300 dark:border-stone-700 hover:bg-gray-100 dark:hover:bg-stone-800 px-8 py-6 text-base"
                  >
                    Create Another Bot
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Dummy function to validate examples - implement your validation logic here
  const validateExamples = async (): Promise<void> => {
    try {
      if (wizardState.examples.length === 0) {
        toast.error("Please add at least one example to validate.");
        return;
      } else if (wizardState.examples.length < 5) {
        toast.warning(
          "It's recommended to add at least 5 examples for better Working of your Bot!."
        );
      }
      setIsValidatingExamples(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/aiFeatures/ValidateExample`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            examples: wizardState.examples,
            botType: wizardState.botType,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(
          data?.message ||
            "Failed to validate examples. Please try again later."
        );
        return;
      }
      const realData = JSON.parse(data?.message || "{}");
      if (realData?.isValid) {
        setWizardState((prev) => ({
          ...prev,
          examplesValidated: true,
        }));
        toast.success(
          "Examples validated successfully! You can proceed to the next step."
        );
      } else {
        setWizardState((prev) => ({
          ...prev,
          examplesValidated: false,
          examplesValidationError:
            realData?.reasons ||
            "Examples validation failed due to unknown reasons.",
        }));
        toast.error(
          "Examples validation failed. Please check the errors and try again."
        );
      }
    } catch (error) {
      toast.error(
        "An unexpected error occurred during examples validation. Please try again."
      );
      console.log("Error validating examples:", error);
    } finally {
      setIsValidatingExamples(false);
    }
  };

  const runApiTest = async (): Promise<void> => {
    if (
      wizardState.apiEndpoint.includes("localhost") ||
      wizardState.apiEndpoint.startsWith("file://")
    ) {
      setWizardState((prev) => ({
        ...prev,
        apiTestPassed: false,
        apiTestResult:
          "API Test Failed: Localhost or file:// endpoints are not accessible from our servers.",
      }));
      toast.error(
        "API Test Failed! Localhost or file:// endpoints are not accessible from our servers."
      );
      return;
    }

    try {
      setIsValidating(true);
      setValidationError("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/botConfig/testUserGivenApi`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ apiEndpoint: wizardState.apiEndpoint }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setWizardState((prev) => ({
          ...prev,
          apiTestPassed: false,
          responseFormat : "",
          apiTestResult: `API Test Failed: Received status ${response.status}`,
        }));

        toast.error(
          "API Test Failed! Check your Endpoint or give permission to access this API on server."
        );
        return;
      }
      setWizardState((prev) => ({
        ...prev,
        apiTestPassed: true,
        responseFormat: data
          ? JSON.stringify(data, null, 2)
          : prev.responseFormat,
        apiTestResult: `API Test Succeeded: Received response ${JSON.stringify(
          data
        )}`,
      }));
      toast.success("API Test Succeeded! Now bot can able to use this API. ");
    } finally {
      setIsValidating(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Button variant="ghost" className="animate-pulse">
          <Spinner className="mr-2" />
        </Button>
      </div>
    );
  }

  if (doesFound === false) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-pink-50 dark:bg-stone-950 py-8 px-4">
        <div className="max-w-2xl w-full">
          <Card className="bg-white dark:bg-stone-900 border-gray-200 dark:border-stone-800">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Bot Not Found
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                We could not find a bot with the id{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {botId || "(unknown)"}
                </span>
                .
              </p>

              <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
                You can configure this bot from the Manage page or create a new
                bot to get started.
              </p>

              <div className="flex items-center justify-center gap-3">
                <Link href="/home/CreateBots/ManageBots">
                  <Button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100">
                    Go to Manage Bots
                  </Button>
                </Link>

                <Link href="/home/CreateBots/Website/FreeStyle">
                  <Button
                    variant="outline"
                    className="bg-white dark:bg-stone-900 text-gray-900 dark:text-white border-gray-300 dark:border-stone-700 hover:bg-gray-100 dark:hover:bg-stone-800"
                  >
                    Create New Bot
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const updateState = <K extends keyof WizardState>(
    key: K,
    value: WizardState[K]
  ) => {
    setWizardState((prev) => ({ ...prev, [key]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return wizardState.botType !== "";
      case 2:
        return wizardState.tone !== "" && wizardState.verbosity !== "";
      case 3:
        return (
          wizardState.websiteType !== "" &&
          (wizardState.websiteType !== "Other" ||
            wizardState.otherWebsiteType.trim().length >= 3)
        );
      case 4:
        return wizardState.behaviorDescription.trim().length >= 100;
      case 5:
        return (
          wizardState.examples.some(
            (ex) => ex.question.trim() && ex.answer.trim()
          ) && wizardState.examplesValidated
        );
      case 6:
        if (!wizardState.apiEnabled) return true;
        return wizardState.apiTestPassed === true;
      default:
        return true;
    }
  };

  const validateTextWithAPI = async (): Promise<boolean> => {
    try {
      setIsValidating(true);
      setValidationError("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/aiFeatures/ValidateText`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: wizardState.behaviorDescription,
            botType: wizardState.botType,
          }),
          credentials: "include",
        }
      );

      const data = await response.json();
      if (!response.ok) {
        setValidationError("unexpected error occurred. Please inform support.");
        return false;
      }
      const newData = JSON.parse(data.validationResult);

      if (newData.result == true) {
        toast.success("Text validated successfully.");
        return true;
      } else {
        setValidationError(
          newData.reason || "Validation failed. Please check your input."
        );
        return false;
      }
    } catch (error) {
      console.error("Error validating text:", error);
      setValidationError(
        "An error occurred while validating. Please try again."
      );
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const sendWebsiteBotConfig = async (): Promise<void> => {
    try{
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/botConfig/setConfig`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, botId, botStyle : "free-style", botType : wizardState.botType, websiteType: wizardState.websiteType, otherWebsiteType: wizardState.otherWebsiteType, tone: wizardState.tone, verbosity: wizardState.verbosity, behaviorDescription: wizardState.behaviorDescription, OwnerInformation : wizardState.OwnerInformation, additionalInformation : wizardState.additionalInformation, examples: wizardState.examples, apiEnabled: wizardState.apiEnabled, apiEndpoint: wizardState.apiEndpoint, apiUsageRules: wizardState.apiUsageRules, responseFormat: wizardState.responseFormat }),
      }
    );

    if(response.ok){
      setIsFilledUp(true);
    }
    else{
      if(response.status == 405){
        setAlreadyFilledUp(true);
        toast.warning("This bot has already been set up. If you want to make changes, please go to the Manage Bots page.");
      }
      else{
        const data = await response.json();
        toast.error(data?.message || "Failed to submit bot configuration. Please try again later.");
      }
    }

    }
    catch(e){
      console.error("Error in setting loading state:", e);
    }
    finally{
      setLoading(false);
    }

  }

  const handleNext = async () => {
    if (validateStep(currentStep)) {
      // Special validation for Step 4 with API call
      if (currentStep === 4) {
        const isValid = await validateTextWithAPI();
        if (!isValid) {
          toast.error("Validation failed. Please review the errors below.");
          return;
        }
      }

      if (currentStep < TOTAL_STEPS) {
        setCurrentStep((prev) => prev + 1);
      } else {
        // Final submission
        console.log("Submitting wizard data:", wizardState);
        sendWebsiteBotConfig();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setValidationError("");
      setCurrentStep((prev) => prev - 1);
    }
  };

  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-pink-50 dark:bg-stone-950 py-8 px-4">
      <Toaster position="top-right" richColors />
      <div className="max-w-3xl mx-auto">
        <div className="w-full font-outfit">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            SETUP YOUR BOT :
          </h1>
          <h2 className="text-2xl  text-gray-900 dark:text-white mb-2">
            {botName
              ? `Configuring Bot - ${botName}`
              : "Creating a New Website Free-Style Bot"}
          </h2>
        </div>

        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create Website Free-Style Bot
            </h1>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Step {currentStep} of {TOTAL_STEPS}
            </span>
          </div>
          <Progress
            value={progress}
            className="h-2 bg-gray-200 dark:bg-gray-800"
          />
        </div>

        {/* Step Content */}
        <Card className="bg-white dark:bg-stone-900 border-gray-200 dark:border-stone-800">
          <CardContent className="pt-6">
            <InfoBanner />
            {currentStep === 1 && (
              <Step1BotType
                value={wizardState.botType}
                onChange={(val) => updateState("botType", val)}
              />
            )}

            {currentStep === 2 && (
              <Step2Personality
                tone={wizardState.tone}
                verbosity={wizardState.verbosity}
                onToneChange={(val) => updateState("tone", val)}
                onVerbosityChange={(val) => updateState("verbosity", val)}
              />
            )}

            {currentStep === 3 && (
              <Step3WebsiteContext
                value={wizardState.websiteType}
                onChange={(val) => updateState("websiteType", val)}
                otherValue={wizardState.otherWebsiteType}
                onChangeOther={(val) => updateState("otherWebsiteType", val)}
              />
            )}

            {currentStep === 4 && (
              <Step4Behavior
                description={wizardState.behaviorDescription}
                OwnerInformation={wizardState.OwnerInformation}
                additionalInformation={wizardState.additionalInformation}
                onDescriptionChange={(val) =>
                  updateState("behaviorDescription", val)
                }
                onOwnerInformationChange={(val) =>
                  updateState("OwnerInformation", val)
                }
                onAdditionalInformationChange={(val) =>
                  updateState("additionalInformation", val)
                }
                validationError={validationError}
                isValidating={isValidating}
              />
            )}

            {currentStep === 5 && (
              <Step5Examples
                examples={wizardState.examples}
                onChange={(val) => {
                  updateState("examples", val);
                  // Reset validation when examples change
                  updateState("examplesValidated", false);
                  updateState("examplesValidationError", "");
                }}
                isValidated={wizardState.examplesValidated}
                validationError={wizardState.examplesValidationError}
                onValidate={validateExamples}
                isValidating={isValidatingExamples}
              />
            )}

            {currentStep === 6 && (
              <Step6API
                enabled={wizardState.apiEnabled}
                endpoint={wizardState.apiEndpoint}
                apiUsageRules={wizardState.apiUsageRules}
                responseFormat={wizardState.responseFormat}
                onEnabledChange={(val) => updateState("apiEnabled", val)}
                onEndpointChange={(val) => updateState("apiEndpoint", val)}
                onApiUsageRulesChange={(val) =>
                  updateState("apiUsageRules", val)
                }
                onResponseFormatChange={(val) =>
                  updateState("responseFormat", val)
                }
                onRunTest={async () => {
                  await runApiTest();
                }}
                testResult={wizardState.apiTestResult}
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6">
          <Button
            onClick={handleBack}
            variant="outline"
            disabled={currentStep === 1 || isValidating}
            className="bg-white dark:bg-stone-900 text-gray-900 dark:text-white border-gray-300 dark:border-stone-700 hover:bg-gray-100 dark:hover:bg-stone-800"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!validateStep(currentStep) || isValidating}
            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
          >
            {currentStep === TOTAL_STEPS ? "Create Bot" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
