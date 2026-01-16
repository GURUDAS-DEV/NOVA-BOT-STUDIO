'use client';

import { useState, useMemo } from 'react';
import { Plus, Trash2, ChevronRight, ArrowLeft, Eye, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ActionType = 'show-options' | 'api-call' | 'llm-response' | 'end';

interface BotOption {
  id: string;
  label: string;
  actionType: ActionType;
  nextStepId?: string;
  apiEndpoint?: string;
  apiMethod?: 'GET' | 'POST' | 'PUT';
  llmPrompt?: string;
  endMessage?: string;
}

interface BotStep {
  id: string;
  title: string;
  message: string;
  options: BotOption[];
}

interface Bot {
  id: string;
  name: string;
  steps: BotStep[];
}

type TrailStep = { stepId: string; optionId?: string; label: string };

export default function ControlledBotBuilder() {
  const botId = 'bot-1';
  const botName = 'Support Bot';

  const [bot, setBot] = useState<Bot>({
    id: botId,
    name: botName,
    steps: [
      {
        id: 'step-1',
        title: 'Welcome',
        message: 'Hi! How can I help you today?',
        options: [
          { id: 'opt-1', label: 'Check Order', actionType: 'show-options', nextStepId: 'step-2' },
          { id: 'opt-2', label: 'Technical Support', actionType: 'api-call', apiEndpoint: 'https://api.example.com/support', apiMethod: 'POST' },
        ],
      },
      {
        id: 'step-2',
        title: 'Order Details',
        message: 'Please enter your order number:',
        options: [
          { id: 'opt-3', label: 'Help', actionType: 'llm-response', llmPrompt: 'Suggest helpful information about order tracking' },
          { id: 'opt-4', label: 'Back', actionType: 'show-options', nextStepId: 'step-1' },
        ],
      },
    ],
  });

  const [selectedStepId, setSelectedStepId] = useState<string>('step-1');
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [previewTrail, setPreviewTrail] = useState<TrailStep[]>([{ stepId: 'step-1', label: 'Welcome' }]);

  const selectedStep = bot.steps.find(s => s.id === selectedStepId);
  const selectedOption = selectedStep?.options.find(o => o.id === selectedOptionId);

  // Preview mode helpers
  const handlePreviewOption = (option: BotOption) => {
    const newTrail: TrailStep[] = [...previewTrail, { stepId: selectedStepId, optionId: option.id, label: `→ ${option.label}` }];

    if (option.actionType === 'show-options' && option.nextStepId) {
      const nextStep = bot.steps.find(s => s.id === option.nextStepId);
      if (nextStep) {
        newTrail.push({ stepId: nextStep.id, label: nextStep.title });
        setSelectedStepId(nextStep.id);
        setSelectedOptionId(null);
      }
    } else {
      // For api-call, llm-response, end - show a response
      newTrail.push({ stepId: selectedStepId, optionId: `response-${option.id}`, label: `[Response: ${option.actionType}]` });
    }

    setPreviewTrail(newTrail);
    setSelectedOptionId(option.id);
  };

  const handlePreviewBack = () => {
    if (previewTrail.length > 1) {
      const newTrail = previewTrail.slice(0, -1);
      setPreviewTrail(newTrail);
      const lastStep = newTrail[newTrail.length - 1];
      if (lastStep.stepId !== selectedStepId) {
        setSelectedStepId(lastStep.stepId);
      }
    }
  };

  // Edit mode helpers
  const updateStep = (stepId: string, field: keyof BotStep, value: any) => {
    setBot(prev => ({
      ...prev,
      steps: prev.steps.map(s =>
        s.id === stepId ? { ...s, [field]: value } : s
      ),
    }));
  };

  const updateOption = (stepId: string, optionId: string, field: keyof BotOption, value: any) => {
    setBot(prev => ({
      ...prev,
      steps: prev.steps.map(s =>
        s.id === stepId
          ? {
              ...s,
              options: s.options.map(o =>
                o.id === optionId ? { ...o, [field]: value } : o
              ),
            }
          : s
      ),
    }));
  };

  const addStep = () => {
    const newStepId = `step-${Date.now()}`;
    const newStep: BotStep = {
      id: newStepId,
      title: 'New Step',
      message: 'Enter message here...',
      options: [],
    };
    setBot(prev => ({
      ...prev,
      steps: [...prev.steps, newStep],
    }));
    setSelectedStepId(newStepId);
  };

  const deleteStep = (stepId: string) => {
    if (bot.steps.length === 1) {
      alert('Cannot delete the only step');
      return;
    }
    setBot(prev => ({
      ...prev,
      steps: prev.steps.filter(s => s.id !== stepId),
    }));
    if (selectedStepId === stepId) {
      setSelectedStepId(bot.steps[0].id);
    }
  };

  const addOption = (stepId: string) => {
    const newOptionId = `opt-${Date.now()}`;
    const newOption: BotOption = {
      id: newOptionId,
      label: 'New Option',
      actionType: 'show-options',
    };
    updateStep(stepId, 'options', [...(selectedStep?.options || []), newOption]);
  };

  const deleteOption = (stepId: string, optionId: string) => {
    const step = bot.steps.find(s => s.id === stepId);
    if (step) {
      updateStep(stepId, 'options', step.options.filter(o => o.id !== optionId));
    }
  };

  return (
    <div className="flex h-screen bg-stone-900 text-white font-inter">
      {/* Left: Editor Panel */}
      <div className="w-96 border-r border-stone-700 p-6 overflow-y-auto flex flex-col">
        {selectedOption ? (
          // Edit Option
          <div>
            <div className="mb-4">
              <Button
                onClick={() => setSelectedOptionId(null)}
                variant="ghost"
                className="text-stone-400 hover:text-white mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Step
              </Button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Option Label</label>
              <input
                type="text"
                value={selectedOption.label}
                onChange={e => updateOption(selectedStepId, selectedOptionId, 'label', e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white placeholder-stone-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-3">Choose Action Type</label>
              <div className="space-y-2">
                {['show-options', 'api-call', 'llm-response', 'end'].map(actionType => (
                  <button
                    key={actionType}
                    onClick={() => updateOption(selectedStepId, selectedOptionId, 'actionType', actionType)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedOption.actionType === actionType
                        ? 'bg-pink-600/20 border-pink-600'
                        : 'bg-stone-800 border-stone-700 hover:border-pink-600/50'
                    }`}
                  >
                    <div className="font-medium text-sm capitalize">{actionType.replace('-', ' ')}</div>
                    <div className="text-xs text-stone-400 mt-1">
                      {actionType === 'show-options' && 'Navigate to next step'}
                      {actionType === 'api-call' && 'Call an API endpoint'}
                      {actionType === 'llm-response' && 'Get LLM generated response'}
                      {actionType === 'end' && 'End the conversation'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Config based on action type */}
            {selectedOption.actionType === 'show-options' && (
              <div>
                <label className="block text-sm font-medium mb-2">Link to Step</label>
                <select
                  value={selectedOption.nextStepId || ''}
                  onChange={e => updateOption(selectedStepId, selectedOptionId, 'nextStepId', e.target.value || undefined)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="">-- Select a step --</option>
                  {bot.steps.map(step => (
                    <option key={step.id} value={step.id}>
                      {step.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedOption.actionType === 'api-call' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2">API Endpoint</label>
                  <input
                    type="text"
                    value={selectedOption.apiEndpoint || ''}
                    onChange={e => updateOption(selectedStepId, selectedOptionId, 'apiEndpoint', e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white placeholder-stone-500"
                    placeholder="https://api.example.com/endpoint"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Method</label>
                  <select
                    value={selectedOption.apiMethod || 'GET'}
                    onChange={e => updateOption(selectedStepId, selectedOptionId, 'apiMethod', e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                  </select>
                </div>
              </div>
            )}

            {selectedOption.actionType === 'llm-response' && (
              <div>
                <label className="block text-sm font-medium mb-2">LLM Prompt</label>
                <textarea
                  value={selectedOption.llmPrompt || ''}
                  onChange={e => updateOption(selectedStepId, selectedOptionId, 'llmPrompt', e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white placeholder-stone-500 h-24 resize-none"
                  placeholder="Enter prompt for the LLM..."
                />
              </div>
            )}

            {selectedOption.actionType === 'end' && (
              <div>
                <label className="block text-sm font-medium mb-2">End Message</label>
                <input
                  type="text"
                  value={selectedOption.endMessage || ''}
                  onChange={e => updateOption(selectedStepId, selectedOptionId, 'endMessage', e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white placeholder-stone-500"
                  placeholder="Thank you for chatting!"
                />
              </div>
            )}

            <Button
              onClick={() => deleteOption(selectedStepId, selectedOptionId)}
              variant="ghost"
              className="w-full text-red-400 hover:bg-red-500/10 mt-6"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Option
            </Button>
          </div>
        ) : selectedStep ? (
          // Edit Step
          <div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Step Title</label>
              <input
                type="text"
                value={selectedStep.title}
                onChange={e => updateStep(selectedStepId, 'title', e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white placeholder-stone-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                value={selectedStep.message}
                onChange={e => updateStep(selectedStepId, 'message', e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white placeholder-stone-500 h-24 resize-none"
              />
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium">Options</label>
                <Button
                  onClick={() => addOption(selectedStepId)}
                  size="sm"
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add
                </Button>
              </div>

              <div className="space-y-2">
                {selectedStep.options.map(option => (
                  <div
                    key={option.id}
                    onClick={() => setSelectedOptionId(option.id)}
                    className="p-3 bg-stone-800 border border-stone-700 rounded-lg cursor-pointer hover:border-pink-600 transition-colors"
                  >
                    <div className="font-medium text-sm text-white">{option.label}</div>
                    <div className="text-xs text-stone-400 mt-1 capitalize">{option.actionType.replace('-', ' ')}</div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={() => deleteStep(selectedStepId)}
              variant="ghost"
              className="w-full text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Step
            </Button>
          </div>
        ) : null}
      </div>

      {/* Right: Bot Flow Preview */}
      <div className="flex-1 p-6 overflow-y-auto bg-stone-950 flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-outfit font-bold">Bot Flow</h2>
          <div className="flex gap-2">
            <Button
              onClick={addStep}
              className="bg-pink-600 hover:bg-pink-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Step
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl space-y-6">
            {/* Step list with flow */}
            {bot.steps.map((step, stepIdx) => (
              <div key={step.id} className="space-y-3">
                {/* Step card */}
                <div
                  onClick={() => {
                    setSelectedStepId(step.id);
                    setSelectedOptionId(null);
                  }}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedStepId === step.id
                      ? 'bg-pink-600/20 border-pink-600'
                      : 'bg-stone-800 border-stone-700 hover:border-stone-600'
                  }`}
                >
                  <div className="font-semibold text-pink-400 text-sm">{step.title}</div>
                  <div className="text-sm text-stone-300 mt-1">{step.message}</div>
                </div>

                {/* Options for this step */}
                {step.options.length > 0 && (
                  <div className="ml-4 space-y-2">
                    {step.options.map((option, optIdx) => {
                      const nextStep = option.nextStepId ? bot.steps.find(s => s.id === option.nextStepId) : null;
                      const isSelected = selectedOptionId === option.id && selectedStepId === step.id;
                      
                      return (
                        <div key={option.id} className="space-y-2">
                          {/* Option button */}
                          <button
                            onClick={() => {
                              setSelectedStepId(step.id);
                              setSelectedOptionId(option.id);
                            }}
                            className={`w-full text-left p-3 rounded-lg border transition-all ${
                              isSelected
                                ? 'bg-stone-700 border-pink-600'
                                : 'bg-stone-800 border-stone-700 hover:border-stone-600'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <ChevronRight className="w-4 h-4 text-stone-500" />
                              <div>
                                <div className="font-medium text-sm text-white">{option.label}</div>
                                <div className="text-xs text-stone-400 capitalize">{option.actionType.replace('-', ' ')}</div>
                              </div>
                            </div>
                          </button>

                          {/* Link indicator */}
                          {nextStep && (
                            <div className="ml-6 text-xs text-stone-500 flex items-center gap-1">
                              <ChevronRight className="w-3 h-3" />
                              Links to: <span className="text-pink-400">{nextStep.title}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Arrow to next step */}
                {stepIdx < bot.steps.length - 1 && (
                  <div className="flex justify-center py-2">
                    <div className="text-stone-600">↓</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
