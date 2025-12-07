
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import Image from "next/image";
import { FaTwitter, FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 dark:bg-black text-white overflow-hidden">
      {/* Main Footer Content */}
      <div className="w-full max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Section */}
        <div className="flex flex-col gap-6">
          <div>
            <div>
                <Image src="/LogoVarient.png" alt="Nova Bot Studio Logo" width={150} height={50} />
            </div>
            <p className="text-sm text-gray-400 mt-2" style={{ fontFamily: "var(--font-inter)" }}>
              The ultimate AI bot platform for automation
            </p>
          </div>
          <div className="flex gap-4">
            <SocialIcon href="https://www.linkedin.com/in/gurudas-bhardwaj-b900a5314/" icon={<FaLinkedin className="h-5 w-5" />} />
            <SocialIcon href="https://github.com/GURUDAS-DEV" icon={<FaGithub className="h-5 w-5" />} />
            <SocialIcon href="https://www.instagram.com/whynott_.gurudas/" icon={<FaInstagram className="h-5 w-5" />} />
            <SocialIcon href="" icon={<FaTwitter className="h-5 w-5" />} />
          </div>
        </div>

        {/* Product Links */}
        <div>
          <h3
            className="text-lg font-semibold text-white mb-6"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Product
          </h3>
          <ul className="space-y-3">
            <FooterLink href="#features">Features</FooterLink>
            <FooterLink href="#pricing">Pricing</FooterLink>
            <FooterLink href="#integrations">Integrations</FooterLink>
            <FooterLink href="#documentation">Documentation</FooterLink>
            <FooterLink href="#changelog">Changelog</FooterLink>
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h3
            className="text-lg font-semibold text-white mb-6"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Company
          </h3>
          <ul className="space-y-3">
            <FooterLink href="#about">About Us</FooterLink>
            <FooterLink href="#blog">Blog</FooterLink>
            <FooterLink href="#careers">Careers</FooterLink>
            <FooterLink href="#contact">Contact</FooterLink>
            <FooterLink href="#press">Press Kit</FooterLink>
          </ul>
        </div>

        {/* Legal & Support */}
        <div>
          <h3
            className="text-lg font-semibold text-white mb-6"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Support
          </h3>
          <ul className="space-y-3">
            <FooterLink href="#help">Help Center</FooterLink>
            <FooterLink href="#privacy">Privacy Policy</FooterLink>
            <FooterLink href="#terms">Terms of Service</FooterLink>
            <FooterLink href="#security">Security</FooterLink>
            <FooterLink href="#status">Status</FooterLink>
          </ul>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="w-full border-t border-gray-800">
        <div className="w-full max-w-7xl mx-auto px-6 py-12">
          <div className="bg-linear-to-r from-blue-600/20 to-pink-600/20 rounded-2xl border border-gray-800 p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3
                  className="text-2xl md:text-3xl font-bold text-white mb-2"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  Stay Updated
                </h3>
                <p className="text-gray-400" style={{ fontFamily: "var(--font-inter)" }}>
                  Get the latest updates and features delivered to your inbox
                </p>
              </div>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
                  style={{ fontFamily: "var(--font-inter)" }}
                />
                <button className="px-6 py-3 bg-linear-to-r from-pink-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="w-full border-t border-gray-800">
        <div className="w-full max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <ContactItem
            icon={<Mail className="h-5 w-5 text-pink-500" />}
            title="Email"
            value="support@novabot.studio"
          />
          <ContactItem
            icon={<Phone className="h-5 w-5 text-blue-500" />}
            title="Phone"
            value="+91 (123) 456-7890"
          />
          <ContactItem
            icon={<MapPin className="h-5 w-5 text-purple-500" />}
            title="Location"
            value="India"
          />
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="w-full border-t border-gray-800 bg-black/50">
        <div className="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm" style={{ fontFamily: "var(--font-inter)" }}>
            &copy; 2025 Nova Bot Studio. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
              Sitemap
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
              Cookie Settings
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

function FooterLink({ href, children }: { href: string; children: string }) {
  return (
    <li>
      <a
        href={href}
        className="text-gray-400 hover:text-white transition-colors duration-200"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {children}
      </a>
    </li>
  );
}

function SocialIcon({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      className="p-2 rounded-lg bg-gray-800 hover:bg-pink-600 transition-all duration-300 hover:scale-110 text-gray-400 hover:text-white"
    >
      {icon}
    </a>
  );
}

function ContactItem({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="p-3 rounded-lg bg-gray-800">{icon}</div>
      <div>
        <h4
          className="text-sm font-semibold text-gray-400 mb-1"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          {title}
        </h4>
        <p className="text-white" style={{ fontFamily: "var(--font-inter)" }}>
          {value}
        </p>
      </div>
    </div>
  );
}

export default Footer
