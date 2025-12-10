"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, CreditCard, Settings, Shield, Zap, Users } from "lucide-react";


const FAQPage = () => {
  return (
    <div className="w-full overflow-hidden">
      

      {/* Hero Section */}
      <div className="w-full pt-40 pb-16 px-6 bg-pink-50 dark:bg-stone-900">
        <div className="w-full max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-sm border border-gray-300 dark:border-gray-700 mb-6">
            <HelpCircle className="w-4 h-4 text-pink-500" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 font-outfit">
              Help Center
            </p>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-black dark:text-white mb-6 font-space-grotesk">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8 font-inter">
            Find answers to common questions about Nova Bot Studio, our features, pricing, and more.
          </p>
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="w-full px-6 py-20 bg-pink-50 dark:bg-stone-900">
        <div className="w-full max-w-5xl mx-auto space-y-12">
          {/* Getting Started */}
          <FAQCategory
            icon={<Zap className="h-6 w-6 text-blue-500" />}
            title="Getting Started"
            questions={[
              {
                q: "What is Nova Bot Studio and how does it work?",
                a: "Nova Bot Studio is an all-in-one platform for creating and managing AI-powered bots without coding. Simply design your bot using our intuitive interface, configure it for your chosen platform (Instagram, Discord, Telegram, WhatsApp, or your website), and deploy it instantly. Our platform handles all the complex backend infrastructure, allowing you to focus on your bot's logic and user experience."
              },
              {
                q: "Do I need coding experience to create a bot?",
                a: "Absolutely not! Nova Bot Studio is designed for creators of all skill levels. Our drag-and-drop interface and pre-built templates make it easy to create sophisticated bots without writing a single line of code. If you do have coding experience, advanced users can also customize bots with custom scripts and integrations."
              },
              {
                q: "How long does it take to set up my first bot?",
                a: "Most users can create and deploy their first basic bot in under 5 minutes! Our quick-start wizard guides you through connecting your platform, choosing a template, and customizing responses. More complex bots with advanced automation may take 15-30 minutes to configure."
              },
              {
                q: "Which platforms are supported?",
                a: "We currently support 5 major platforms: Instagram (DM automation), Telegram (bots & commands), Discord (server bots & moderation), WhatsApp (chat automation), and custom websites (via widget or API). All plans include access to all platforms."
              },
              {
                q: "Can I test the platform before committing?",
                a: "Yes! We offer a completely free plan with no credit card required. You get 1 bot per platform, up to 2,000 messages per month, and access to all core features. This allows you to fully test the platform before deciding to upgrade."
              }
            ]}
          />

          {/* Features & Functionality */}
          <FAQCategory
            icon={<Settings className="h-6 w-6 text-purple-500" />}
            title="Features & Functionality"
            questions={[
              {
                q: "What types of automation can I create?",
                a: "You can create various automations including: automated message replies, keyword-triggered responses, welcome messages for new followers/members, FAQ answering bots, lead capture and qualification, appointment scheduling, order status updates, customer support chatbots, and custom workflows based on user actions or external triggers via webhooks."
              },
              {
                q: "Can I use AI for my bot responses?",
                a: "Yes! Nova Bot Studio integrates with advanced AI models to generate intelligent, context-aware responses. You can configure AI-powered conversations that understand user intent, maintain conversation context, and provide natural, helpful responses. AI features are available on all paid plans."
              },
              {
                q: "How do I manage multiple bots?",
                a: "Our unified dashboard lets you manage all your bots from one place. You can switch between platforms, view analytics for each bot, edit configurations, monitor conversations in real-time, and manage settings individually or apply changes across multiple bots simultaneously."
              },
              {
                q: "Can I integrate with other tools and services?",
                a: "Absolutely! We offer webhook integrations, REST API access, and native integrations with popular tools like Google Sheets, Zapier, Slack, and more. You can trigger external actions based on bot interactions or use external data to personalize bot responses."
              },
              {
                q: "What analytics and reporting features are available?",
                a: "You get comprehensive analytics including: message volume and response times, user engagement metrics, conversation success rates, peak usage times, platform-specific insights, conversion tracking, and custom reports. Premium plans include advanced analytics with historical data and export capabilities."
              },
              {
                q: "Can I customize the bot's personality and tone?",
                a: "Yes! You have complete control over your bot's personality, tone, and voice. Set custom greetings, define response styles (formal, casual, friendly, professional), create branded experiences, and even use different personalities for different conversation contexts or user segments."
              }
            ]}
          />

          {/* Pricing & Billing */}
          <FAQCategory
            icon={<CreditCard className="h-6 w-6 text-green-500" />}
            title="Pricing & Billing"
            questions={[
              {
                q: "What features do I get in the free plan?",
                a: "The free plan includes access to all 5 platforms, up to 1 bot per platform (5 total), 1,000-2,000 messages per month, 50 API calls per minute, basic analytics dashboard, webhook integrations, and community support. It's perfect for getting started and testing the platform with no credit card required."
              },
              {
                q: "Can I upgrade or cancel my plan anytime?",
                a: "Yes! You can upgrade to a higher plan or downgrade anytime with immediate effect. Premium upgrades are prorated, so you only pay for what you use. Cancellations take effect at the end of your billing cycle, and you can reactivate your account anytime. No hidden fees or long-term commitments required."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), debit cards, and PayPal. For Deluxe enterprise plans, we can also arrange wire transfers, ACH payments, and custom invoicing with NET-30 or NET-60 terms."
              },
              {
                q: "Do you offer discounts for annual billing?",
                a: "Yes! Annual subscribers receive 2 months free (equivalent to over 15% savings). We also offer special discounts for non-profits, educational institutions, and startups. Contact our sales team for volume discounts on multiple accounts or enterprise pricing."
              },
              {
                q: "What happens if I exceed my plan limits?",
                a: "If you approach your plan limits, we'll send you notifications via email and in-app alerts. You can upgrade your plan at any time to increase limits. For temporary spikes, we offer flexible overage pricing. Your bots will continue functioning, and we'll work with you to find the right plan for your needs."
              },
              {
                q: "Is there a free trial for premium features?",
                a: "While our free plan is available indefinitely, we also offer a 14-day free trial of Premium features for new users. This gives you full access to unlimited bots, advanced analytics, priority support, and all premium features without requiring a credit card."
              }
            ]}
          />

          {/* Security & Privacy */}
          <FAQCategory
            icon={<Shield className="h-6 w-6 text-red-500" />}
            title="Security & Privacy"
            questions={[
              {
                q: "How is my data stored and is it secure?",
                a: "Your data is encrypted both in transit (using SSL/TLS) and at rest (using AES-256 encryption). We store data on secure, geographically distributed servers with automatic backups and redundancy. We comply with GDPR, CCPA, SOC 2, and other major data protection regulations. Regular security audits and penetration testing ensure your data remains protected."
              },
              {
                q: "Who has access to my bot conversations?",
                a: "Only you and authorized team members you explicitly grant access to can view your bot conversations. Nova Bot Studio employees never access your data unless you explicitly request support assistance. All data access is logged and monitored for security purposes."
              },
              {
                q: "Do you share data with third parties?",
                a: "We never sell your data to third parties. We only share data with service providers necessary to operate the platform (like hosting providers), and they are bound by strict confidentiality agreements. You maintain complete ownership of your data and can export or delete it at any time."
              },
              {
                q: "What happens to my data if I cancel my account?",
                a: "When you cancel your account, your data is retained for 30 days in case you wish to reactivate. After 30 days, all your data is permanently deleted from our systems. You can request immediate data deletion at any time, and we'll provide confirmation once the process is complete."
              },
              {
                q: "Are the bots GDPR and CCPA compliant?",
                a: "Yes! Our platform is designed with privacy regulations in mind. We provide tools to help you comply with GDPR, CCPA, and other privacy laws including: consent management, data export capabilities, right to deletion, privacy policy templates, and automatic data retention controls."
              },
              {
                q: "How do you handle platform authentication and credentials?",
                a: "We use OAuth 2.0 for platform connections whenever possible, meaning we never store your passwords. Access tokens are encrypted and stored securely. You can revoke access to any connected platform at any time from your dashboard, and tokens automatically expire and refresh based on platform security requirements."
              }
            ]}
          />

          {/* Technical Support */}
          <FAQCategory
            icon={<Users className="h-6 w-6 text-amber-500" />}
            title="Technical Support"
            questions={[
              {
                q: "What kind of support do you offer?",
                a: "Free plan users get access to our community forum and knowledge base. Premium users receive priority email support with 24-hour response times. Deluxe customers get 24/7 dedicated support via email, chat, and phone, with direct access to our technical team and account managers."
              },
              {
                q: "What if my bot stops working?",
                a: "First, check our status page to see if there are any platform-wide issues. If the problem is specific to your bot, try restarting it from your dashboard. If issues persist, contact support with details about the problem, and our team will investigate and resolve it quickly. We maintain 99.9% uptime and provide status updates for any incidents."
              },
              {
                q: "Can you help me build a custom bot?",
                a: "Yes! Our Deluxe plan includes custom bot development services. Our team will work with you to understand your requirements, design the bot strategy, build the automation, and handle deployment. We also offer onboarding sessions and training for your team."
              },
              {
                q: "Do you provide documentation and tutorials?",
                a: "Absolutely! We have extensive documentation covering all features, video tutorials for common use cases, step-by-step guides for each platform, API documentation for developers, and regularly updated blog posts with tips and best practices. All documentation is searchable and available 24/7."
              },
              {
                q: "What is your uptime guarantee?",
                a: "We guarantee 99.9% uptime for all paid plans, backed by our SLA (Service Level Agreement). This means your bots will be operational and responsive almost all the time. In the rare event of extended downtime, Premium and Deluxe customers receive service credits as outlined in our SLA."
              },
              {
                q: "How often do you release updates and new features?",
                a: "We release minor updates and bug fixes weekly, with major feature releases monthly. All updates are automatically applied to your account with zero downtime. We announce new features via email, in-app notifications, and our changelog. Premium and Deluxe customers get early access to beta features."
              }
            ]}
          />

          {/* Platform-Specific */}
          <FAQCategory
            icon={<HelpCircle className="h-6 w-6 text-cyan-500" />}
            title="Platform-Specific Questions"
            questions={[
              {
                q: "How does Instagram bot automation work?",
                a: "For Instagram, we provide DM automation tools that automatically respond to direct messages based on keywords, user actions, or triggers. You can set up automated welcome messages, FAQ responses, engagement campaigns, and lead capture flows. All automation complies with Instagram's terms of service and rate limits."
              },
              {
                q: "Can I create command-based bots for Telegram?",
                a: "Yes! Telegram bots on Nova Bot Studio support custom commands (like /start, /help), inline queries, keyboard buttons, and webhook-based triggers. You can create interactive bots with menus, forms, and multi-step conversations. Full Telegram Bot API access is available."
              },
              {
                q: "What Discord bot features are available?",
                a: "Discord bots can handle commands, moderation tasks, welcome messages, role management, auto-moderation (spam detection, profanity filters), event-based triggers, voice channel automation, and integration with Discord's slash commands. Perfect for community management and server automation."
              },
              {
                q: "How do I integrate a chatbot on my website?",
                a: "We provide a simple JavaScript widget that you can embed on any website with just a few lines of code. Alternatively, use our REST API to build custom integrations. The widget is fully customizable (colors, position, branding) and works on any modern website platform including WordPress, Shopify, Wix, and custom sites."
              },
              {
                q: "Does WhatsApp automation comply with their policies?",
                a: "Yes! We follow WhatsApp Business API guidelines strictly. Your WhatsApp bots can handle customer inquiries, send notifications, provide support, and automate common workflows while staying compliant with WhatsApp's rules. We handle all the technical integration and compliance requirements."
              },
              {
                q: "Can I use the same bot across multiple platforms?",
                a: "While bots are platform-specific due to different APIs and capabilities, you can easily duplicate bot logic and responses across platforms from your dashboard. This allows you to maintain consistent messaging and automation across Instagram, Telegram, Discord, WhatsApp, and your website."
              }
            ]}
          />
        </div>
      </div>

      {/* Still Have Questions CTA */}
      <div className="w-full px-6 py-20 bg-pink-100 dark:bg-black">
        <div className="w-full max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-6 font-space-grotesk">
            Still Have Questions?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 font-inter">
            Can&apos;t find the answer you&apos;re looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-linear-to-r from-pink-600 to-blue-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105">
              Contact Support
            </button>
            <button className="px-8 py-4 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white rounded-lg font-semibold text-lg hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300">
              Join Community
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

function FAQCategory({
  icon,
  title,
  questions,
}: {
  icon: React.ReactNode;
  title: string;
  questions: { q: string; a: string }[];
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-lg bg-white dark:bg-gray-900 shadow-md">
          {icon}
        </div>
        <h2 className="text-3xl font-bold text-black dark:text-white font-space-grotesk">
          {title}
        </h2>
      </div>
      <div className="space-y-3">
        {questions.map((item, index) => (
          <FAQItem key={index} question={item.q} answer={item.a} />
        ))}
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl cursor-pointer font-outfit border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-white dark:bg-gray-900 hover:bg-gray-50 cursor-pointer dark:hover:bg-gray-800 transition-colors"
      >
        <h3 className="text-base font-semibold text-black dark:text-white text-left pr-4">
          {question}
        </h3>
        <ChevronDown
          className={`h-5 w-5 text-gray-600 dark:text-gray-400 shrink-0 transition-transform duration-300 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black/50 animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-gray-700 text-left dark:text-gray-300 font-inter leading-relaxed">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default FAQPage;
