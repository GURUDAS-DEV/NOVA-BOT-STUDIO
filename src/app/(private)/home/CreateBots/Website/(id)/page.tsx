"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { MdClose, MdAdd } from "react-icons/md";

// Types
type BotType = "FAQ" | "Customer Assistant" | "Advisor" | "Comparison" | "Navigator" | "";
type Tone = "Professional" | "Friendly" | "Casual" | "Formal" | "";
type Verbosity = "Concise" | "Balanced" | "Detailed" | "";
type WebsiteType = "E-commerce" | "Blog" | "Portfolio" | "Corporate" | "Educational" | "Other" | "";

interface QAPair {
  id: string;
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
  
  // Step 4
  behaviorDescription: string;
  allowedTopics: string;
  disallowedTopics: string;
  
  // Step 5
  examples: QAPair[];
  
  // Step 6
  apiEnabled: boolean;
  apiEndpoint: string;
  responseFormat: string;
}

const TOTAL_STEPS = 6;

// Step 1: Bot Type Selection
const Step1BotType = ({ 
  value, 
  onChange 
}: { 
  value: BotType; 
  onChange: (value: BotType) => void;
}) => {
  const botTypes: { value: BotType; label: string; description: string }[] = [
    { value: "FAQ", label: "FAQ Bot", description: "Answers frequently asked questions" },
    { value: "Customer Assistant", label: "Customer Assistant", description: "Helps customers with inquiries" },
    { value: "Advisor", label: "Advisor", description: "Provides expert advice and recommendations" },
    { value: "Comparison", label: "Comparison", description: "Compares products or services" },
    { value: "Navigator", label: "Navigator", description: "Guides users through your website" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Select Bot Type</h3>
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
            <div className="font-medium text-gray-900 dark:text-white">{type.label}</div>
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
  onVerbosityChange 
}: { 
  tone: Tone;
  verbosity: Verbosity;
  onToneChange: (value: Tone) => void;
  onVerbosityChange: (value: Verbosity) => void;
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Bot Personality</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Define how your bot communicates with users
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-900 dark:text-white">Tone</label>
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
        <label className="text-sm font-medium text-gray-900 dark:text-white">Verbosity</label>
        <Select value={verbosity} onValueChange={(val) => onVerbosityChange(val as Verbosity)}>
          <SelectTrigger className="dark:bg-black bg-white dark:text-white text-black font-outfit">
            <SelectValue placeholder="Select verbosity" className="dark:bg-black bg-white dark:text-white text-black font-outfit" />
          </SelectTrigger>
          <SelectContent className="dark:bg-black bg-white dark:text-white text-black font-outfit">
            <SelectItem value="Concise">Concise - Short and to the point</SelectItem>
            <SelectItem value="Balanced">Balanced - Moderate detail</SelectItem>
            <SelectItem value="Detailed">Detailed - Comprehensive responses</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

// Step 3: Website Context
const Step3WebsiteContext = ({ 
  value, 
  onChange 
}: { 
  value: WebsiteType;
  onChange: (value: WebsiteType) => void;
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Website Context</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          What type of website will this bot be used on?
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-900 dark:text-white">Website Type</label>
        <Select value={value} onValueChange={(val) => onChange(val as WebsiteType)}>
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
    </div>
  );
};

// Step 4: Bot Behavior
const Step4Behavior = ({ 
  description,
  allowedTopics,
  disallowedTopics,
  onDescriptionChange,
  onAllowedTopicsChange,
  onDisallowedTopicsChange,
}: { 
  description: string;
  allowedTopics: string;
  disallowedTopics: string;
  onDescriptionChange: (value: string) => void;
  onAllowedTopicsChange: (value: string) => void;
  onDisallowedTopicsChange: (value: string) => void;
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Bot Behavior</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Define how your bot should behave and what topics it can discuss
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-900 dark:text-white">Detailed Description</label>
        <Textarea
          placeholder="Describe how your bot should behave, its purpose, and how it should interact with users..."
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="min-h-[120px] dark:bg-black bg-white dark:text-white text-black"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-900 dark:text-white">Allowed Topics</label>
        <Textarea
          placeholder="List topics the bot can discuss (comma separated)..."
          value={allowedTopics}
          onChange={(e) => onAllowedTopicsChange(e.target.value)}
          className="min-h-[80px] dark:bg-black bg-white dark:text-white text-black"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-900 dark:text-white">Disallowed Topics</label>
        <Textarea
          placeholder="List topics the bot should avoid (comma separated)..."
          value={disallowedTopics}
          onChange={(e) => onDisallowedTopicsChange(e.target.value)}
          className="min-h-[80px] dark:bg-black bg-white dark:text-white text-black"
        />
      </div>
    </div>
  );
};

// Step 5: Examples
const Step5Examples = ({ 
  examples, 
  onChange 
}: { 
  examples: QAPair[];
  onChange: (examples: QAPair[]) => void;
}) => {
  const addExample = () => {
    onChange([
      ...examples,
      { id: Date.now().toString(), question: "", answer: "" }
    ]);
  };

  const removeExample = (id: string) => {
    onChange(examples.filter(ex => ex.id !== id));
  };

  const updateExample = (id: string, field: "question" | "answer", value: string) => {
    onChange(
      examples.map(ex => 
        ex.id === id ? { ...ex, [field]: value } : ex
      )
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Training Examples</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Provide example question-answer pairs to train your bot
        </p>
      </div>

      <div className="space-y-4">
        {examples.map((example, index) => (
          <Card key={example.id} className="bg-gray-50 dark:bg-stone-800/50 border-gray-200 dark:border-stone-700">
            <CardHeader className="pb-3">
              <div className="flex items-center dark:text-white text-black justify-between">
                <CardTitle className="text-base dark:text-white text-black">Example {index + 1}</CardTitle>
                {examples.length > 1 && (
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => removeExample(example.id)}
                  >
                    <MdClose className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-white">User Question</label>
                <Input
                  placeholder="What might a user ask?"
                  value={example.question}
                  className="dark:bg-black bg-white dark:text-white text-black"
                  onChange={(e) => updateExample(example.id, "question", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-white">Bot Answer</label>
                <Textarea
                  placeholder="How should the bot respond?"
                  value={example.answer}
                  onChange={(e) => updateExample(example.id, "answer", e.target.value)}
                  className="min-h-[80px] dark:bg-black bg-white dark:text-white text-black"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={addExample} variant="outline" className="w-full dark:bg-black bg-white dark:text-white text-black">
        <MdAdd className="h-4 w-4 mr-2 " />
        Add Example
      </Button>
    </div>
  );
};

// Step 6: API Integration
const Step6API = ({ 
  enabled,
  endpoint,
  responseFormat,
  onEnabledChange,
  onEndpointChange,
  onResponseFormatChange,
}: { 
  enabled: boolean;
  endpoint: string;
  responseFormat: string;
  onEnabledChange: (value: boolean) => void;
  onEndpointChange: (value: string) => void;
  onResponseFormatChange: (value: string) => void;
}) => {
  const [testResult, setTestResult] = useState<string>("");

  const testAPI = () => {
    // Mock API test
    setTestResult("✓ API connection successful");
    setTimeout(() => setTestResult(""), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">API Integration</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Optionally connect an external API for dynamic responses
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
        <label htmlFor="api-enabled" className="text-sm font-medium cursor-pointer text-gray-900 dark:text-white">
          Enable API Integration
        </label>
      </div>

      {enabled && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-white">API Endpoint</label>
            <Input
            className="dark:bg-black bg-white dark:text-white text-black"
              placeholder="https://api.example.com/endpoint"
              value={endpoint}
              onChange={(e) => onEndpointChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-white">Expected Response Format</label>
            <Textarea
              placeholder='{"response": "string", "data": {...}}'
              value={responseFormat}
              onChange={(e) => onResponseFormatChange(e.target.value)}
              className="min-h-[100px] font-mono text-xs dark:bg-black bg-white dark:text-white text-black"
            />
          </div>

          <div className="space-y-2">
            <Button onClick={testAPI}  variant="outline" className="w-full dark:bg-black bg-white dark:text-white text-black">
              Test API Connection
            </Button>
            {testResult && (
              <p className="text-sm text-green-600 dark:text-green-400 text-center">
                {testResult}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Main Wizard Component
export default function CreateWebsiteBotWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardState, setWizardState] = useState<WizardState>({
    botType: "",
    tone: "",
    verbosity: "",
    websiteType: "",
    behaviorDescription: "",
    allowedTopics: "",
    disallowedTopics: "",
    examples: [{ id: "1", question: "", answer: "" }],
    apiEnabled: false,
    apiEndpoint: "",
    responseFormat: "",
  });

  const updateState = <K extends keyof WizardState>(
    key: K,
    value: WizardState[K]
  ) => {
    setWizardState(prev => ({ ...prev, [key]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return wizardState.botType !== "";
      case 2:
        return wizardState.tone !== "" && wizardState.verbosity !== "";
      case 3:
        return wizardState.websiteType !== "";
      case 4:
        return wizardState.behaviorDescription.trim().length > 0;
      case 5:
        return wizardState.examples.some(ex => ex.question.trim() && ex.answer.trim());
      case 6:
        if (!wizardState.apiEnabled) return true;
        return wizardState.apiEndpoint.trim().length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(prev => prev + 1);
      } else {
        // Final submission
        console.log("Submitting wizard data:", wizardState);
        alert("Bot created successfully! (This is a demo)");
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-pink-50 dark:bg-stone-950 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Website Free-Style Bot</h1>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Step {currentStep} of {TOTAL_STEPS}
            </span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-200 dark:bg-gray-800" />
        </div>

        {/* Step Content */}
        <Card className="bg-white dark:bg-stone-900 border-gray-200 dark:border-stone-800">
          <CardContent className="pt-6">
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
              />
            )}

            {currentStep === 4 && (
              <Step4Behavior
                description={wizardState.behaviorDescription}
                allowedTopics={wizardState.allowedTopics}
                disallowedTopics={wizardState.disallowedTopics}
                onDescriptionChange={(val) => updateState("behaviorDescription", val)}
                onAllowedTopicsChange={(val) => updateState("allowedTopics", val)}
                onDisallowedTopicsChange={(val) => updateState("disallowedTopics", val)}
              />
            )}

            {currentStep === 5 && (
              <Step5Examples
                examples={wizardState.examples}
                onChange={(val) => updateState("examples", val)}
              />
            )}

            {currentStep === 6 && (
              <Step6API
                enabled={wizardState.apiEnabled}
                endpoint={wizardState.apiEndpoint}
                responseFormat={wizardState.responseFormat}
                onEnabledChange={(val) => updateState("apiEnabled", val)}
                onEndpointChange={(val) => updateState("apiEndpoint", val)}
                onResponseFormatChange={(val) => updateState("responseFormat", val)}
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6">
          <Button
            onClick={handleBack}
            variant="outline"
            disabled={currentStep === 1}
            className="bg-white dark:bg-stone-900 text-gray-900 dark:text-white border-gray-300 dark:border-stone-700 hover:bg-gray-100 dark:hover:bg-stone-800"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!validateStep(currentStep)}
            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
          >
            {currentStep === TOTAL_STEPS ? "Create Bot" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
