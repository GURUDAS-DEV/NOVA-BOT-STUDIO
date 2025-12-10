"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, Crown, Sparkles, Mail, X, Check } from "lucide-react";

const PricingPage = () => {
  return (
    <div className="w-full overflow-hidden">


      {/* Hero Section */}
      <div className="w-full pt-40 pb-16 px-6 bg-pink-50 dark:bg-stone-900">
        <div className="w-full max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-sm border border-gray-300 dark:border-gray-700 mb-6">
            <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 font-outfit">
              Simple & Transparent Pricing
            </p>
          </div>
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-black dark:text-white mb-6 font-space-grotesk"
          >
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8 font-inter">
            Start free, scale as you grow. All plans include access to all 5 platforms with no hidden fees.
          </p>
        </div>
      </div>

      {/* Pricing Cards Section */}
      <div className="w-full px-6 py-20 bg-pink-100 dark:bg-black">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Free Plan */}
            <div className="rounded-2xl font-inter border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-black dark:text-white mb-2 font-outfit">Free</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-bold text-black dark:text-white">$0</span>
                  <span className="text-gray-600 dark:text-gray-400">/month</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">Perfect for getting started and testing the platform</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">All 5 platforms supported</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">1 bot per platform (5 total)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">1,000 - 2,000 messages/month</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">10-20 messages per minute</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">50 API calls per minute</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Basic analytics dashboard</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Community support</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">No credit card required</span>
                </li>
              </ul>

              <Button className="w-full bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
                Get Started Free
              </Button>
            </div>

            {/* Premium Plan */}
            <div className="rounded-2xl font-inter border-2 border-blue-500 dark:border-blue-600 bg-white dark:bg-gray-900 p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 relative scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-linear-to-r from-pink-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-6 w-6 text-amber-500" />
                  <h3 className="text-2xl font-bold text-black dark:text-white font-outfit">Premium</h3>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-bold text-black dark:text-white">$29</span>
                  <span className="text-gray-600 dark:text-gray-400">/month</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">Ideal for growing businesses and power users</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">All 5 platforms supported</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300"><strong>Unlimited bots</strong> & automations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">10,000 - 20,000 messages/month</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">20-40 messages per minute</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">100-150 API calls per minute</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Advanced analytics & insights</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Priority email support</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Custom branding options</span>
                </li>
              </ul>

              <Button className="w-full bg-linear-to-r from-pink-600 to-blue-600 text-white hover:opacity-90">
                Upgrade to Premium
              </Button>
            </div>

            {/* Deluxe Plan */}
            <div className="rounded-2xl font-inter border-2 border-purple-500 dark:border-purple-600 bg-white dark:bg-gray-900 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-6 w-6 text-indigo-400" />
                  <h3 className="text-2xl font-bold text-black dark:text-white font-outfit">Deluxe</h3>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-black dark:text-white">Custom</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">We build and manage your bots for you</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Custom bot strategy & build</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Dedicated setup & onboarding</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Unlimited bots & messages</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Unlimited API calls</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">White-label solutions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">24/7 dedicated support</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Direct access to developers</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Usage-based pricing</span>
                </li>
              </ul>

              <Button className="w-full bg-linear-to-r from-amber-600 to-purple-400 text-white hover:opacity-90">
                <Mail className="h-4 w-4 mr-2" /> Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table Section */}
      <div className="w-full px-6 py-20 bg-pink-50 dark:bg-stone-900">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4 font-space-grotesk">
              Detailed Comparison
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg font-inter">
              Compare all features across our pricing plans
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white font-outfit">Features</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-black dark:text-white font-outfit">Free</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-black dark:text-white font-outfit bg-blue-50 dark:bg-blue-900/20">Premium</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-black dark:text-white font-outfit">Deluxe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <ComparisonRow
                  feature="Supported Platforms"
                  free="5"
                  premium="5"
                  deluxe="5"
                />
                <ComparisonRow
                  feature="Number of Bots"
                  free="1 per platform"
                  premium="Unlimited"
                  deluxe="Unlimited"
                />
                <ComparisonRow
                  feature="Messages per Month"
                  free="1,000 - 2,000"
                  premium="10,000 - 20,000"
                  deluxe="Unlimited"
                />
                <ComparisonRow
                  feature="Messages per Minute"
                  free="10-20"
                  premium="20-40"
                  deluxe="Unlimited"
                />
                <ComparisonRow
                  feature="API Calls per Minute"
                  free="50"
                  premium="100-150"
                  deluxe="Unlimited"
                />
                <ComparisonRow
                  feature="Analytics Dashboard"
                  free={true}
                  premium={true}
                  deluxe={true}
                />
                <ComparisonRow
                  feature="Advanced Analytics"
                  free={false}
                  premium={true}
                  deluxe={true}
                />
                <ComparisonRow
                  feature="Custom Branding"
                  free={false}
                  premium={true}
                  deluxe={true}
                />
                <ComparisonRow
                  feature="White-Label Solution"
                  free={false}
                  premium={false}
                  deluxe={true}
                />
                <ComparisonRow
                  feature="Priority Support"
                  free={false}
                  premium={true}
                  deluxe={true}
                />
                <ComparisonRow
                  feature="24/7 Dedicated Support"
                  free={false}
                  premium={false}
                  deluxe={true}
                />
                <ComparisonRow
                  feature="Custom Bot Development"
                  free={false}
                  premium={false}
                  deluxe={true}
                />
                <ComparisonRow
                  feature="Webhook Integrations"
                  free={true}
                  premium={true}
                  deluxe={true}
                />
                <ComparisonRow
                  feature="API Access"
                  free={true}
                  premium={true}
                  deluxe={true}
                />
                <ComparisonRow
                  feature="Usage-Based Scaling"
                  free={false}
                  premium={false}
                  deluxe={true}
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="w-full px-6 py-20 bg-pink-100 dark:bg-black">
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4 font-space-grotesk">
              Pricing FAQs
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg font-inter">
              Common questions about our pricing plans
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2 font-outfit">Can I switch plans anytime?</h3>
              <p className="text-gray-600 dark:text-gray-400 font-inter">Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we prorate any billing differences.</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2 font-outfit">What payment methods do you accept?</h3>
              <p className="text-gray-600 dark:text-gray-400 font-inter">We accept all major credit cards, debit cards, and PayPal. For Deluxe plans, we can also arrange wire transfers and custom invoicing.</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2 font-outfit">Is there a long-term commitment?</h3>
              <p className="text-gray-600 dark:text-gray-400 font-inter">No, all our plans are month-to-month with no long-term contracts. Cancel anytime with no penalties or hidden fees.</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2 font-outfit">Do you offer discounts for annual billing?</h3>
              <p className="text-gray-600 dark:text-gray-400 font-inter">Yes! Annual subscribers get 2 months free (save over 15%). Contact our sales team for enterprise and volume discounts.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full px-6 py-20 bg-pink-50 dark:bg-stone-900">
        <div className="w-full max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-6 font-space-grotesk">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 font-inter">
            Join thousands of businesses automating their workflows with Nova Bot Studio
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-linear-to-r from-pink-600 to-blue-600 text-white px-8 py-4 text-lg font-semibold hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105">
              Start Free Trial
            </Button>
            <Button variant="outline" className="border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white px-8 py-4 text-lg font-semibold hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
};

function ComparisonRow({
  feature,
  free,
  premium,
  deluxe,
}: {
  feature: string;
  free: string | boolean;
  premium: string | boolean;
  deluxe: string | boolean;
}) {
  const renderCell = (value: string | boolean) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="h-5 w-5 text-green-500 mx-auto" />
      ) : (
        <X className="h-5 w-5 text-gray-400 mx-auto" />
      );
    }
    return <span className="text-gray-700 dark:text-gray-300 font-inter">{value}</span>;
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="px-6 py-4 text-sm font-medium text-black dark:text-white font-inter">{feature}</td>
      <td className="px-6 py-4 text-sm text-center">{renderCell(free)}</td>
      <td className="px-6 py-4 text-sm text-center bg-blue-50/50 dark:bg-blue-900/10">{renderCell(premium)}</td>
      <td className="px-6 py-4 text-sm text-center">{renderCell(deluxe)}</td>
    </tr>
  );
}

export default PricingPage;
