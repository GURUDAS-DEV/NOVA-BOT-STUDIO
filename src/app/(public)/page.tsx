import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Crown, Sparkles, Mail } from "lucide-react";
import Image from "next/image";
import { AiFillInstagram } from "react-icons/ai";
import { FaDiscord, FaFacebook, FaTelegram, FaWhatsapp } from "react-icons/fa";
import { TbWorldCode } from "react-icons/tb";
import { FAQItem } from "@/components/FAQItemClient";

export default function Home() {
  

  
  return (
    <div className="w-full overflow-hidden">
      <div className="min-h-screen overflow-hidden flex flex-col justify-center items-center premium-animated-gradient pt-20">
        <div className="w-full max-w-6xl px-6 flex flex-col gap-8 text-center">
          {/* Subtitle */}
          <div className="flex mt-14 justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-sm border border-white/20 dark:border-white/10">
              <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Welcome to the Future of Bot Building
              </p>
            </div>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1
              className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              <span className="bg-linear-to-r from-blue-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">
                Introducing
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                Nova Bot Studio
              </span>
            </h1>
          </div>

          {/* Subheading */}
          <p
            className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            The Ultimate AI Bot Platform
          </p>

          {/* Description */}
          <p
            className="max-w-3xl mx-auto text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Create, customize, and manage powerful AI bots — all in one unified
            platform.
            <br className="hidden md:block" />
            Nova Bot Studio makes automation simple, fast, and beautifully
            intuitive.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center pt-4">
            <button
              className="group cursor-pointer relative px-8 py-4 bg-linear-to-r from-pink-600 to-blue-600 text-white rounded-lg font-semibold text-lg hover:shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              <span>Join Now & Get Started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        <div className="w-full relative   mt-14 h-32">
          <svg
            className="w-full  absolute bg-transparent rotate-180 bottom-0 left-0 fill-pink-50 dark:fill-stone-700"
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="
    M0 50
    C300 20 500 20 720 50
    C1000 80 1200 80 1440 50
    V0 H0 Z
  "
            ></path>
          </svg>
        </div>
      </div>

      <div className="w-full pb-10  bg-pink-50 dark:bg-stone-700 overflow-hidden">
        <div className="w-full flex flex-col justify-center items-center">
          <div className="pt-14 pb-8">
            <button className="px-4 cursor-pointer py-2 text-white dark:text-white dark:bg-stone-500 bg-blue-400 border border-blue-400 dark:border-stone-400 rounded-3xl font-outfit font-medium hover:bg-blue-500 dark:hover:bg-stone-600 transition-colors">
              Our Features
            </button>
          </div>
          <div className="flex font-medium font-space-grotesk justify-center items-center w-full flex-col gap-2">
            <h1 className=" text-2xl text-center sm:text-3xl md:text-4xl lg:text-5xl text-black dark:text-white">
              Create your first Customize Bot
            </h1>
            <h1 className=" text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-black dark:text-white">
              For any platform
            </h1>
          </div>
          <div className="w-full pt-5  flex justify-center items-center">
            <h3 className="w-[90%] sm:w-[70%] md:w-[60%] lg:w-[40%] text-base md:text-xl text-center text-black dark:text-white font-outfit">
              Create your bot! automate your Social Media! Make your Life
              easier.
            </h3>
          </div>

          <div className="flex flex-col justify-center items-center mt-12 sm:mt-16 md:mt-24 w-full px-4">
            {/* single upper line crossing through all the cards */}
            <div className="relative w-full flex justify-center items-center flex-col">
              <div className="w-full h-1 "></div>
              <div className="h-1 w-[60%] sm:w-[50%] md:w-[39%] flex border-t-2 border-t-black dark:border-t-white"></div>
              {/* first 3 icon list */}
              <div className="absolute -top-[20%] flex justify-center items-center gap-[8%] sm:gap-[10%] w-full">
                <IconCard>
                  <FaWhatsapp className="h-7 w-7 sm:h-9 sm:w-9 md:h-11 md:w-11 text-green-600" />
                </IconCard>
                <IconCard>
                  <AiFillInstagram className="h-7 w-7 sm:h-9 sm:w-9 md:h-11 md:w-11 text-pink-500" />
                </IconCard>
                <IconCard>
                  <FaTelegram className="h-7 w-7 sm:h-9 sm:w-9 md:h-11 md:w-11 text-blue-400" />
                </IconCard>
              </div>
              {/* 2 lines connecting upper one line */}
              <div className="w-screen h-auto flex justify-center items-center gap-32 sm:gap-40 md:gap-56">
                <div className="h-[100px] sm:h-[130px] md:h-[155px] -mt-1 w-1 border-l-2 border-l-black dark:border-l-white"></div>
                <div className="h-[100px] sm:h-[130px] md:h-[155px] -mt-1 w-1 border-l-2 border-l-black dark:border-l-white"></div>
              </div>
              <div className=""></div>

              <div className="absolute flex justify-center items-center top-[65%] sm:top-[68%] md:top-[70%] gap-24 sm:gap-28 md:gap-36 w-full">
                <IconCard>
                  <FaDiscord className="h-7 w-7 sm:h-9 sm:w-9 md:h-11 md:w-11 text-indigo-500" />
                </IconCard>
                <IconCard>
                  <TbWorldCode className="h-7 w-7 sm:h-9 sm:w-9 md:h-11 md:w-11 text-gray-500 dark:text-gray-400" />
                </IconCard>
              </div>
              <div className="h-1 mt-6 sm:mt-8 md:mt-10 w-[30%] sm:w-[25%] md:w-[20%] flex border-t-2 border-t-black dark:border-t-white"></div>
            </div>
            <div className="w-full flex justify-center items-center">
              <div className="h-[100px] sm:h-[120px] md:h-[150px] -mt-1 w-1 border-r-2 border-r-black dark:border-r-white"></div>
            </div>
            <div className="-mt-3 sm:-mt-4 md:-mt-5 px-4">
              <Image
                src="/LandingPageImage1.png"
                alt="LandingPageImage1.png"
                width={800}
                height={600}
                className="w-full max-w-[300px] sm:max-w-[500px] md:max-w-[650px] lg:max-w-[800px] h-auto"
              />
            </div>
            {/* 3 lines connecting upper image  */}
            <div className="w-full -mt-4 sm:-mt-5 md:-mt-6 h-auto flex justify-center items-center gap-[18%] sm:gap-[20%] md:gap-[22%]">
              <div className="h-[100px] sm:h-[130px] md:h-[155px] -mt-1 w-1 border-l-2 border-l-black dark:border-l-white"></div>
              <div className="h-[100px] sm:h-[130px] md:h-[155px] -mt-1 w-1 border-l-2 border-l-black dark:border-l-white"></div>
              <div className="h-[100px] sm:h-[130px] md:h-[155px] -mt-1 w-1 border-l-2 border-l-black dark:border-l-white"></div>
            </div>

            <div className="w-full flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-[10%] px-4">
              <FeatureCard>
                <div className="h-full w-full flex justify-center gap-2 flex-col items-center">
                  <Image
                    src="/LandingPageImage2.png"
                    height={120}
                    width={120}
                    alt="image_of_eye"
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28"
                  />
                  <div className="font-outfit text-center text-lg sm:text-xl md:text-2xl">
                    <h2>Create</h2>
                    <h2>Bots</h2>
                  </div>
                </div>
              </FeatureCard>
              <FeatureCard>
                <div className="h-full w-full flex justify-center gap-2 flex-col items-center">
                  <Image
                    src="/LandingPageImage3.png"
                    height={120}
                    width={120}
                    alt="image_of_eye"
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28"
                  />
                  <div className="font-outfit text-center text-lg sm:text-xl md:text-2xl">
                    <h2>Automate</h2>
                    <h2>Things</h2>
                  </div>
                </div>
              </FeatureCard>
              <FeatureCard>
                <div className="h-full w-full flex justify-center gap-2 flex-col items-center">
                  <Image
                    src="/LandingPageImage4.png"
                    height={120}
                    width={120}
                    alt="image_of_eye"
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28"
                  />
                  <div className="font-outfit text-center text-lg sm:text-xl md:text-2xl">
                    <h2>Analyze</h2>
                    <h2>All</h2>
                  </div>
                </div>
              </FeatureCard>
            </div>
            <div className="flex w-full justify-center mt-8 sm:mt-10 items-center font-outfit px-4">
              <div className="flex text-center flex-col w-full sm:w-[85%] md:w-[75%] lg:w-[68%] text-black gap-4 sm:gap-5 dark:text-white text-sm sm:text-base md:text-lg justify-center items-center">
                <h1>By using NOVA BOT STUDIO, You can create a custom AI Powered Bot on platform like Instagram, Whatsapp, Discord, Telegram and for your own webpage Also. On the top of it, you can also automate your messaging system on the selected platforms!</h1>
                <Button size="default" className="bg-blue-400 dark:bg-black w-full sm:w-auto">Join Us now</Button>
              </div>
            </div>

            {/* Simple Divider after Features */}
            <div className="w-full my-16  flex justify-center">
              <div className="w-full max-w-6xl h-px bg-linear-to-r from-gray-300 via-gray-600 dark:via-gray-700 to-gray-300"></div>
            </div>

            {/* Services Section */}
            <section className="w-full max-w-6xl mt-8 mb-6 px-6 text-center">
              <div className="flex flex-col gap-3 items-center mb-12">
                <p className="text-sm uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400 font-outfit">Services</p>
                <h2 className="text-4xl md:text-5xl font-space-grotesk text-black dark:text-white font-semibold tracking-tight">
                  Deploy Anywhere
                </h2>
                <p className="max-w-2xl text-gray-700 dark:text-gray-300 font-inter text-base md:text-lg">
                  Support for all major platforms in one unified ecosystem
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-5">
                {/* Instagram */}
                <ServiceCard
                  icon={<AiFillInstagram className="h-12 w-12 text-pink-500" />}
                  title="Instagram"
                  description="DM automation"
                />

                {/* Telegram */}
                <ServiceCard
                  icon={<FaTelegram className="h-12 w-12 text-blue-400" />}
                  title="Telegram"
                  description="Bot commands"
                />

                {/* Discord */}
                <ServiceCard
                  icon={<FaDiscord className="h-12 w-12 text-indigo-500" />}
                  title="Discord"
                  description="Server automation"
                />

                {/* WhatsApp */}
                <ServiceCard
                  icon={<FaWhatsapp className="h-12 w-12 text-green-500" />}
                  title="WhatsApp"
                  description="Chat automation"
                />

                {/* Custom Website */}
                <ServiceCard
                  icon={<TbWorldCode className="h-12 w-12 text-gray-600 dark:text-gray-400" />}
                  title="Your Website"
                  description="Custom widget"
                />
              </div>
            </section>

            {/* Simple Divider before Pricing */}
            <div className="w-full my-16  flex justify-center">
              <div className="w-full max-w-6xl h-px bg-linear-to-r from-gray-300 via-gray-600 dark:via-gray-700 to-gray-300"></div>
            </div>

            {/* Pricing Section */}
            <section className="w-full max-w-6xl mt-8 mb-6 px-6 text-center">
              <div className="flex flex-col gap-3 items-center mb-10">
                <p className="text-sm uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400 font-outfit">Pricing</p>
                <h2 className="text-4xl md:text-5xl font-space-grotesk text-black dark:text-white font-semibold tracking-tight">
                  Choose the plan that fits you
                </h2>
                <p className="max-w-2xl text-gray-700 dark:text-gray-300 font-inter text-base md:text-lg">
                  Flexible options for creators and teams. All plans include access to all 5 platforms.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {/* Free */}
                <div className="rounded-2xl font-inter border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-semibold text-black dark:text-white">Free</h3>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">1 month</span>
                  </div>
                  <p className="text-4xl font-bold text-black dark:text-white">$0<span className="text-base font-normal text-gray-600 dark:text-gray-400">/mo</span></p>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">Best for low usage</p>
                  <ul className="mt-6 space-y-3 text-left text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />All 5 platforms supported</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />1 bot per platform (5 total)</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />1000 - 2000 message per month</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />10-20 message per minutes</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />50 api call per minute</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />No Credit Card Required</li>
                  </ul>
                  <Button className="w-full mt-6 bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
                    Get Started Free
                  </Button>
                </div>

                {/* Premium */}
                <div className="rounded-2xl font-inter border border-blue-200 dark:border-blue-900 bg-white/70 dark:bg-black/70 p-6 shadow-md ring-1 ring-blue-200/60 dark:ring-blue-900/60">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-semibold text-black dark:text-white flex items-center gap-2"><Crown className="h-5 w-5 text-amber-500" />Premium</h3>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">1 month</span>
                  </div>
                  <p className="text-4xl font-bold text-black dark:text-white">$29<span className="text-base font-normal text-gray-600 dark:text-gray-400">/mon</span></p>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">Best for medium usage</p>
                  <ul className="mt-6 space-y-3 text-left text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-blue-500" />Unlimited bots & automations</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-blue-500" />All platforms included</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-blue-500" />10000-20000 message per month</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-blue-500" />20-40 messages per minutes</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-blue-500" />100-150 api call per minute</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-blue-500" />Advanced analytics</li>
                  </ul>
                  <Button className="w-full mt-6 bg-linear-to-r from-pink-600 to-blue-600 text-white hover:opacity-90">
                    Upgrade to Premium
                  </Button>
                </div>

                {/* Deluxe */}
                <div className="rounded-2xl font-inter border border-amber-700  bg-white dark:bg-black p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-semibold text-black dark:text-white flex items-center gap-2"><Sparkles className="h-5 w-5 text-indigo-400" />Deluxe</h3>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Custom</span>
                  </div>
                  <p className="text-4xl font-bold text-black dark:text-white">Contact<span className="text-base font-normal text-gray-600 dark:text-gray-400"> for pricing</span></p>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">We build your bot for you.</p>
                  <ul className="mt-6 space-y-3 text-left text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-400" />Custom bot strategy & build</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-400" />Dedicated setup & onboarding</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-400" />Usage-based pricing after consult</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-400" />Direct contact with us</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-400" />Best support system</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-400" />Unlimited Api Calls</li>
                  </ul>
                  <Button className="w-full cursor-pointer mt-6  bg-linear-to-r from-amber-600  to-purple-400 text-white">
                    <Mail className="h-4 w-4 mr-2 text-white" /> Contact Me
                  </Button>
                </div>
              </div>
            </section>

            {/* Simple Divider after Pricing */}
            <div className="w-full my-16 px-6 flex justify-center">
              <div className="w-full max-w-6xl h-px bg-linear-to-r from-gray-300 via-gray-600 dark:via-gray-700 to-gray-300"></div>
            </div>

            {/* Testimonials Section */}
            <section className="w-full max-w-6xl mt-8 mb-20 px-6 text-center">
              <div className="flex flex-col gap-3 items-center mb-12">
                <p className="text-sm uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400 font-outfit">Testimonials</p>
                <h2 className="text-4xl md:text-5xl font-space-grotesk text-black dark:text-white font-semibold tracking-tight">
                  What Our Users Say
                </h2>
                <p className="max-w-2xl text-gray-700 dark:text-gray-300 font-inter text-base md:text-lg">
                  Join thousands of creators and businesses transforming their automation workflows.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {/* Testimonial 1 */}
                <TestimonialCard
                  initials="AK"
                  name="Anurag Kumar"
                  title="Bot Creator"
                  feedback="Nova Bot Studio has transformed how I manage my social media. Absolutely incredible platform!"
                  bgGradient="from-blue-400 to-blue-600"
                />

                {/* Testimonial 2 */}
                <TestimonialCard
                  initials="PR"
                  name="Priya Raman"
                  title="Digital Marketer"
                  feedback="The automation features saved me hours every week. This is a game-changer for agencies."
                  bgGradient="from-pink-400 to-purple-600"
                />

                {/* Testimonial 3 */}
                <TestimonialCard
                  initials="VK"
                  name="Vikram Sharma"
                  title="Entrepreneur"
                  feedback="Easy to use and powerful. Highly recommended for anyone serious about scaling their business."
                  bgGradient="from-green-400 to-teal-600"
                />

                {/* Testimonial 4 */}
                <TestimonialCard
                  initials="NS"
                  name="Neha Singh"
                  title="Content Creator"
                  feedback="Finally a platform that understands what creators need. Simple, elegant, and effective."
                  bgGradient="from-amber-400 to-orange-600"
                />

                {/* Testimonial 5 */}
                <TestimonialCard
                  initials="RJ"
                  name="Rajesh Jain"
                  title="SME Owner"
                  feedback="Nova Bot Studio helped me reach more customers without extra effort. Best investment ever!"
                  bgGradient="from-red-400 to-pink-600"
                />

                {/* Testimonial 6 */}
                <TestimonialCard
                  initials="MP"
                  name="Megha Patel"
                  title="Social Media Manager"
                  feedback="The support team is amazing, and the features keep getting better. I love this platform!"
                  bgGradient="from-cyan-400 to-blue-600"
                />
              </div>
            </section>
            <div className="w-full py-16 px-6 flex justify-center">
              <div className="w-full max-w-6xl h-px bg-linear-to-r from-gray-300 via-gray-600 dark:via-gray-700 to-gray-300"></div>
            </div>

            {/* FAQ Section */}
            <div className="w-full  overflow-hidden">
              <div className="w-full flex flex-col justify-center items-center pb-20">
                <section className="w-full max-w-6xl px-6 text-center">
                  <div className="flex flex-col gap-3 items-center mb-16">
                    <p className="text-sm uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400 font-outfit">FAQ</p>
                    <h2 className="text-4xl md:text-5xl font-space-grotesk text-black dark:text-white font-semibold tracking-tight">
                      Frequently Asked Questions
                    </h2>
                    <p className="max-w-2xl text-gray-700 dark:text-gray-300 font-inter text-base md:text-lg">
                      Everything you need to know about Nova Bot Studio
                    </p>
                  </div>

                  <div className="space-y-4">
                    <FAQItem
                      question="What is Nova Bot Studio and how does it work?"
                      answer="Nova Bot Studio is an all-in-one platform for creating and managing AI-powered bots without coding. Simply design your bot using our intuitive interface, configure it for your chosen platform (Instagram, Discord, Telegram, Facebook, or your website), and deploy it instantly. Our platform handles all the complex backend infrastructure, allowing you to focus on your bot's logic and user experience."
                    />
                    <FAQItem
                      question="Do I need coding experience to create a bot?"
                      answer="Absolutely not! Nova Bot Studio is designed for creators of all skill levels. Our drag-and-drop interface and pre-built templates make it easy to create sophisticated bots without writing a single line of code. If you do have coding experience, advanced users can also customize bots with custom scripts and integrations."
                    />
                    <FAQItem
                      question="What features do I get in the free plan?"
                      answer="The free plan includes access to all 5 platforms (Instagram, Discord, Telegram, Facebook, and Website), up to 1 bot per platform (5 total), basic bot templates, 1000-2000 messages per month, 10-20 messages per minute rate limit, and 50 API calls per minute. Perfect for getting started and testing out the platform!"
                    />
                    <FAQItem
                      question="How is my data stored and is it secure?"
                      answer="Your data is encrypted and stored on secure, geographically distributed servers with automatic backups. We comply with GDPR, CCPA, and other major data protection regulations. All communications between your bots and our platform use industry-standard SSL/TLS encryption. We never share your data with third parties without explicit consent."
                    />
                    <FAQItem
                      question="Can I upgrade or cancel my plan anytime?"
                      answer="Yes! You can upgrade to a higher plan or downgrade anytime with immediate effect. Premium upgrades are prorated, so you only pay for what you use. Cancellations take effect at the end of your billing cycle, and you can reactivate your account anytime. No hidden fees or long-term commitments required."
                    />
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

function IconCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-16 w-16 sm:h-20 md:h-24 sm:w-20 md:w-24 rounded-xl bg-white dark:bg-black drop-shadow-2xl flex items-center justify-center">
      {children}
    </div>
  );
}

function FeatureCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-56  cursor-pointer hover:drop-shadow-pink-300 hover:scale-105 dark:hover:drop-shadow-cyan-300 transition-all ease-in-out duration-100 w-48 flex bg-white dark:bg-black text-black dark:text-white justify-center items-center border border-white drop-shadow-2xl rounded-2xl">
      {children}
    </div>
  );
}

function TestimonialCard({
  initials,
  name,
  title,
  feedback,
  bgGradient,
}: {
  initials: string;
  name: string;
  title: string;
  feedback: string;
  bgGradient: string;
}) {
  return (
    <div className="rounded-2xl font-outfit border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-md hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-purple-900/30 transition-all duration-300 hover:scale-105 flex flex-col h-full">
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`h-14 w-14 rounded-full bg-linear-to-br ${bgGradient} flex items-center justify-center text-white font-bold text-lg font-outfit`}
        >
          {initials}
        </div>
        <div className="text-left">
          <h4 className="font-semibold text-black dark:text-white text-lg">{name}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        </div>
      </div>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed grow">
        &quot;{feedback}&quot;
      </p>
      <div className="flex gap-1 mt-4">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-yellow-400">
            ★
          </span>
        ))}
      </div>
    </div>
  );
}

function ServiceCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-xl font-outfit border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-blue-900/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1 flex flex-col items-center text-center">
      <div className="mb-4 p-3 rounded-lg bg-gray-100 dark:bg-black/50">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-black dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
        {description}
      </p>
    </div>
  );
}
