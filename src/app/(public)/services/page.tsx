
"use client";

import { ArrowRight, CheckCircle2, Zap, MessageSquare, BarChart3, Settings } from "lucide-react";
import { AiFillInstagram } from "react-icons/ai";
import { FaDiscord, FaTelegram, FaWhatsapp } from "react-icons/fa";
import { TbWorldCode } from "react-icons/tb";
import { Button } from "@/components/ui/button";

const ServicesPage = () => {
  return (
    <div className="w-full overflow-hidden">

      {/* Hero Section */}
      <div className="w-full pt-40 pb-1 px-6 bg-pink-100 dark:bg-stone-900">
        <div className="w-full max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-sm border border-gray-300 dark:border-gray-700 mb-6">
            <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Platform-Specific Solutions
            </p>
          </div>
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-black dark:text-white mb-6 font-space-grotesk"
          >
            Our Services
          </h1>
          <p
            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8 font-inter"
          >
            Powerful, platform-specific solutions designed to automate and enhance your presence across all major social platforms and websites.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="w-full px-6 py-20 bg-pink-100 dark:bg-stone-900">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Instagram */}
            <ServiceCard
              icon={<AiFillInstagram className="h-16 w-16 text-pink-500" />}
              title="Instagram"
              subtitle="DM Automation & Engagement"
              description="Automate your Instagram direct messages and boost engagement with intelligent responses."
              features={[
                "Automated DM replies to followers",
                "Smart message filtering and routing",
                "Auto-response to common inquiries",
                "Engagement tracking and analytics",
                "Scheduled messaging campaigns",
                "Keyword-based reply system",
              ]}
            />

            {/* Telegram */}
            <ServiceCard
              icon={<FaTelegram className="h-16 w-16 text-blue-400" />}
              title="Telegram"
              subtitle="Bots & Automation"
              description="Create powerful bots and automation workflows for Telegram communities."
              features={[
                "Intelligent chatbots with AI responses",
                "Custom command handlers",
                "Group & channel automation",
                "User management tools",
                "Message scheduling & broadcasting",
                "Webhook-based integrations",
              ]}
            />

            {/* Discord */}
            <ServiceCard
              icon={<FaDiscord className="h-16 w-16 text-indigo-500" />}
              title="Discord"
              subtitle="Bots & Smart Moderation"
              description="Powerful Discord bots for automation, moderation, and community management."
              features={[
                "Custom command systems",
                "Intelligent moderation tools",
                "Auto-answering FAQ boards",
                "Role & permission automation",
                "Message filtering & logging",
                "Event-based automation triggers",
              ]}
            />

            {/* WhatsApp */}
            <ServiceCard
              icon={<FaWhatsapp className="h-16 w-16 text-green-500" />}
              title="WhatsApp"
              subtitle="Bots & Automation"
              description="Automate customer interactions and support with WhatsApp bots."
              features={[
                "Automated customer support bots",
                "Message automation workflows",
                "Quick reply templates",
                "Contact management",
                "Broadcast messaging",
                "Conversation analytics",
              ]}
            />

            {/* Your Website */}
            <ServiceCard
              icon={<TbWorldCode className="h-16 w-16 text-gray-600 dark:text-gray-400" />}
              title="Your Website"
              subtitle="Chatbot Widget & API"
              description="Integrate powerful chatbots directly into your website with our API."
              features={[
                "Easy-to-integrate widget",
                "RESTful API for custom integration",
                "Real-time conversation streaming",
                "User session management",
                "Analytics & insights dashboard",
                "Custom styling & branding",
              ]}
              fullWidth
            />
          </div>
        </div>
      </div>

      {/* Detailed Capabilities Section */}
      <div className="w-full px-6 py-20 bg-pink-50 dark:bg-black">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              What&apos;s Included
            </h2>
            <p
              className="text-gray-600 dark:text-gray-400 text-lg"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Every platform comes with a complete suite of features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <CapabilityBox
              icon={<MessageSquare className="h-8 w-8 text-pink-500" />}
              title="Intelligent Messaging"
              description="AI-powered responses, smart routing, and context-aware replies across all platforms"
            />
            <CapabilityBox
              icon={<Zap className="h-8 w-8 text-blue-500" />}
              title="Instant Automation"
              description="Real-time processing, automated workflows, and trigger-based actions"
            />
            <CapabilityBox
              icon={<BarChart3 className="h-8 w-8 text-purple-500" />}
              title="Advanced Analytics"
              description="Detailed insights, performance metrics, and user engagement tracking"
            />
            <CapabilityBox
              icon={<Settings className="h-8 w-8 text-orange-500" />}
              title="Easy Configuration"
              description="No-code setup, pre-built templates, and intuitive control panels"
            />
            <CapabilityBox
              icon={<CheckCircle2 className="h-8 w-8 text-green-500" />}
              title="Reliability & Support"
              description="99.9% uptime guarantee, 24/7 support, and regular updates"
            />
            <CapabilityBox
              icon={<ArrowRight className="h-8 w-8 text-cyan-500" />}
              title="Seamless Integration"
              description="APIs, webhooks, and plugins for deeper customization"
            />
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="w-full px-6 py-20 bg-pink-100 dark:bg-stone-900">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Getting Started is Simple
            </h2>
            <p
              className="text-gray-600 dark:text-gray-400 text-lg"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Three easy steps to automate your platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Connect Your Platform"
              description="Link your Instagram, Telegram, Discord, WhatsApp, or website to Nova Bot Studio"
            />
            <StepCard
              number="2"
              title="Configure Your Bot"
              description="Set up responses, keywords, workflows, and automation rules using our simple interface"
            />
            <StepCard
              number="3"
              title="Go Live & Monitor"
              description="Deploy instantly and track performance with real-time analytics and dashboards"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full px-6 py-20 bg-pink-50 dark:bg-black">
        <div className="w-full max-w-4xl mx-auto text-center">
          <h2
            className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-6"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Ready to Automate?
          </h2>
          <p
            className="text-gray-600 dark:text-gray-400 text-lg mb-8"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Start with our free plan and scale as you grow. No credit card required.
          </p>
          <Button className="bg-linear-to-r from-pink-600 to-blue-600 text-white px-8 py-4 text-lg font-semibold hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105">
            Get Started Free
          </Button>
        </div>
      </div>

    </div>
  );
};

function ServiceCard({
  icon,
  title,
  subtitle,
  description,
  features,
  fullWidth,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  fullWidth?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${
        fullWidth ? "lg:col-span-2" : ""
      }`}
    >
      <div className="mb-6">
        {icon}
      </div>
      <h3
        className="text-2xl font-bold text-black dark:text-white mb-2"
        style={{ fontFamily: "var(--font-outfit)" }}
      >
        {title}
      </h3>
      <p
        className="text-sm text-black dark:text-white font-outfit font-semibold  bg-linear-to-r bg-clip-text"
        style={{
          backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
        }}
      >
        {subtitle}
      </p>
      <p className="text-gray-600 dark:text-gray-400 my-4" style={{ fontFamily: "var(--font-inter)" }}>
        {description}
      </p>
      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            <span className="text-gray-700 dark:text-gray-300" style={{ fontFamily: "var(--font-inter)" }}>
              {feature}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CapabilityBox({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6 hover:shadow-lg transition-all duration-300">
      <div className="mb-4">{icon}</div>
      <h3
        className="text-lg font-semibold text-black dark:text-white mb-2"
        style={{ fontFamily: "var(--font-outfit)" }}
      >
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400" style={{ fontFamily: "var(--font-inter)" }}>
        {description}
      </p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative">
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-8">
        <div className="absolute -top-4 left-6 w-8 h-8 rounded-full bg-linear-to-r from-pink-600 to-blue-600 text-white flex items-center justify-center font-bold text-sm">
          {number}
        </div>
        <h3
          className="text-lg font-semibold text-black dark:text-white mb-3 mt-4"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400" style={{ fontFamily: "var(--font-inter)" }}>
          {description}
        </p>
      </div>
    </div>
  );
}

export default ServicesPage
