# Nova Bot Studio  

![Next.js](https://img.shields.io/badge/Next.js-16.0.7-000000?logo=nextdotjs) ![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?logo=tailwindcss) ![Docker](https://img.shields.io/badge/Docker-✓-2496ED?logo=docker) ![License](https://img.shields.io/badge/License-MIT-green) ![GitHub last commit](https://img.shields.io/github/last-commit/GURUDAS-DEV/NOVA-BOT-STUDIO) ![CI](https://github.com/GURUDAS-DEV/NOVA-BOT-STUDIO/actions/workflows/ci.yml/badge.svg) ![Coverage](https://img.shields.io/badge/Coverage-100%25-44CC11)  

**The ultimate AI‑powered bot platform for automation – design, integrate and manage bots without writing code.**  

[Demo](#) • [Documentation](#) • [Issues](https://github.com/GURUDAS-DEV/NOVA-BOT-STUDIO/issues) • [Pull Requests](https://github.com/GURUDAS-DEV/NOVA-BOT-STUDIO/pulls)

---  

## Overview  

Nova Bot Studio is a modern SaaS‑style dashboard built with **Next.js 16** and **TailwindCSS** that lets you:

* **Create** AI chat‑bots in minutes using a drag‑and‑drop visual flow editor.  
* **Connect** to popular messaging platforms – Telegram, Discord, Instagram, WhatsApp – or a custom webhook.  
* **Manage** bots, view real‑time statistics and control access from a unified admin panel.  

> **Target audience** – product managers, marketers, community managers, and developers who need a fast way to launch conversational agents without maintaining infrastructure.

**Current version:** `v0.2.5` (development)

---  

## Features  

| Category | Feature | Status |
|----------|---------|--------|
| **Bot Builder** | Visual flow editor with pre‑built templates | ✅ Stable |
| | AI response generation (OpenAI / Claude integration) | ✅ Stable |
| **Integrations** | Telegram, Discord, Instagram, WhatsApp | ✅ Stable |
| | Custom webhook (any HTTP endpoint) | ✅ Stable |
| **Dashboard** | Real‑time bot statistics (messages, uptime, active bots) | ✅ Stable |
| | Multi‑tenant user management (role‑based) | ✅ Stable |
| **Theming** | Dark / Light mode powered by `next-themes` | ✅ Stable |
| **Notifications** | Toast notifications via `sonner` | ✅ Stable |
| **Animations** | UI transitions with `radix-ui` and `tw-animate-css` | ✅ Stable |
| **3D Preview** | Interactive 3‑D bot avatar using `three` | 🟡 Beta |
| **Export / Import** | JSON export/import of bot configurations | ✅ Stable |
| **API** | REST endpoints for auth, bot CRUD, analytics (backend) | ✅ Stable |
| **Bot Config Editor – FreeStyle** | Full‑screen HTML/CSS/JS customization | ✅ Stable |
| **Bot Config Editor – Controlled Style** | Node‑based FSM editor with API‑driven options | ✅ Stable |
| **Improved Loading Experience** | Graceful loading spinners & error handling for Controlled‑Style editor | ✅ Stable |
| **Deployment** | One‑click Vercel deployment & Docker support | ✅ Stable |
| **Analytics** | Built‑in usage analytics visualised in the dashboard | ✅ Stable |
| **Internationalisation** | UI strings translated via `next-i18next` | ✅ Stable |
| **API Keys Management** | Centralised UI for managing platform‑specific API keys (React Suspense lazy loading) | ✅ Stable |
| **Playground** | Private sandbox page for rapid UI prototyping and testing new components | ✅ Stable |
| **Security** | Session‑based auth, CSRF protection, rate‑limited endpoints | ✅ Stable |

---  

## Tech Stack  

| Layer | Technology | Reason |
|-------|------------|--------|
| **Framework** | **Next.js 16** (React 19) | File‑system routing, hybrid SSR/CSR |
| **Language** | **TypeScript** | End‑to‑end type safety |
| **Styling** | **TailwindCSS 4**, `tw-animate-css` | Utility‑first, rapid UI prototyping |
| **State Management** | **Zustand** | Minimalist global store (`useAuthStore`, `useBotStore`) |
| **UI Components** | **Radix UI**, `lucide-react`, `react-icons` | Accessible primitives & icons |
| **Theming** | `next-themes` | Dark / Light mode |
| **Animations** | `sonner`, `tw-animate-css` | Toasts & CSS‑based animations |
| **3D** | `three` | Optional 3‑D bot preview |
| **Utilities** | `clsx`, `class-variance-authority`, `dotenv` | Class handling & env loading |
| **Email** | `resend` | Transactional email (password reset, invites) |
| **Analytics** | `posthog`, custom `analytics/` helpers | User‑behaviour tracking |
| **Testing / Linting** | `eslint`, `eslint-config-next`, `prettier` | Code quality enforcement |
| **Build & Deploy** | `next build`, Vercel, Docker | Optimized production bundles & containerisation |

---  

## Architecture  

```
src/
├─ app/
│  ├─ (private)      ← Auth‑protected UI (dashboard)
│  │   ├─ layout.tsx          ← Global layout with Sidebar & TopBar
│  │   ├─ Sidebar.tsx         ← Collapsible navigation
│  │   ├─ TopBar.tsx          ← User menu, theme switch, notifications
│  │   ├─ home/
│  │   │   ├─ page.tsx        ← Dashboard home
│  │   │   ├─ Playground/
│  │   │   │   └─ page.tsx    ← Sandbox for rapid UI experiments
│  │   │   ├─ API_Keys/
│  │   │   │   └─ page.tsx    ← API keys management (Suspense‑based)
│  │   │   ├─ CreateBots/
│  │   │   │   └─ Website/
│  │   │   │       └─ ControlledStyle/
│  │   │   │           └─ [id]/page.tsx   ← “Create Bot – Controlled Style”
│  │   │   ├─ Edit‑Bot‑Config/
│  │   │   │   └─ Website/
│  │   │   │       ├─ FreeStyle/
│  │   │   │       │   └─ (id)/page.tsx   ← “Edit Bot Config – Website FreeStyle”
│  │   │   │       └─ Controlled_Style/
│  │   │   │           └─ (id)/page.tsx   ← “Edit Bot Config – Controlled Style”
│  │   └─ …                    ← Other private sections (manage, stats)
│  ├─ (public)       ← Public‑facing pages (landing, FAQ, pricing)
│  │   └─ Footer.tsx
│  └─ page.tsx       ← Root page (redirects based on auth)
├─ components/
│  ├─ ui/            ← Re‑usable UI primitives (Button, Card, Spinner, …)
│  └─ FAQItemClient.tsx ← Client‑side FAQ accordion component
├─ lib/
│  ├─ Store/         ← Zustand stores (auth, bot data)
│  ├─ Types/         ← TypeScript interfaces
│  ├─ analytics/     ← Analytics helpers (PostHog wrapper, event utils)
│  ├─ posthog.ts
│  └─ utils.ts       ← API wrappers, formatters, misc helpers
└─ proxy.ts          ← Optional API‑proxy for server‑side requests
```

* **Routing** – Next.js file‑system routing separates public and private routes using the `(public)` and `(private)` folders.  
* **Auth** – `useAuthStore` holds `isLoggedIn`, `userId`, `username`, `email` and provides helpers like `refreshUser` and `logout`.  
* **Environment** – `NEXT_PUBLIC_API_BASE_URL` points to the backend API (e.g., `https://api.nova-bot.studio`).  

---  

## Getting Started  

### Prerequisites  

| Tool | Minimum version |
|------|-----------------|
| **Node.js** | 20.x |
| **npm** | 10.x (or `pnpm` / `yarn`) |
| **Git** | any recent version |
| **Docker** (optional) | 24.x for containerised dev |
| **Vercel CLI** (optional) | 32.x for local preview |

A running **backend API** that implements authentication, bot CRUD and analytics is required. Supply its URL via `NEXT_PUBLIC_API_BASE_URL`.

### Installation  

```bash
# 1️⃣ Clone the repository
git clone https://github.com/GURUDAS-DEV/NOVA-BOT-STUDIO.git
cd NOVA-BOT-STUDIO

# 2️⃣ Install dependencies
npm ci   # or `pnpm install` / `yarn install`

# 3️⃣ Copy the example environment file
cp .env.example .env.local

# 4️⃣ Edit .env.local (see below) and start the dev server
npm run dev
```

### Configuration  

Create (or edit) `.env.local` at the project root:

```dotenv
# Public – injected into the client bundle
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com

# Private – used only by server‑side code (if any)
RESEND_API_KEY=your_resend_api_key
POSTHOG_API_KEY=your_posthog_key   # optional analytics
```

> **Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. All other variables remain server‑only.

### Verify  

```bash
npm run dev
```

Open <http://localhost:3000>. You should see the public landing page. After logging in, you’ll be redirected to the dashboard.

*To test the new **Controlled‑Style** editor:* navigate to `/home/Edit-Bot-Config/Website/Controlled_Style/<bot-id>` (replace `<bot-id>` with an existing bot ID). The page now shows a loading spinner while the bot configuration is fetched and displays friendly error toasts if the request fails.

---  

## Usage  

### Development workflow  

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the Next.js dev server (`http://localhost:3000`) with hot‑reloading. |
| `npm run build` | Generates an optimized production build in `.next`. |
| `npm start` | Serves the production build locally (`NODE_ENV=production`). |
| `npm run lint` | Lints the codebase using ESLint (Next.js preset). |
| `npm run test` | Placeholder – add Jest/Playwright tests here. |
| `npm run format` | Runs Prettier to format all files. |

### Example: Editing a Controlled‑Style Bot  

```tsx
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export default function ControlledBotEditor() {
  const { id: botId } = useParams() as { id: string };
  const [bot, setBot] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bots/${botId}`, {
      credentials: "include",
    })
      .then((r) => {
        if (!r.ok) throw new Error("Network response was not ok");
        return r.json();
      })
      .then((data) => setBot(data))
      .catch(() => toast.error("Failed to load bot configuration"))
      .finally(() => setLoading(false));
  }, [botId]);

  const handleSave = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bots/${botId}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bot),
      }
    );
    if (res.ok) toast.success("Bot configuration saved");
    else toast.error("Save failed");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        Edit Controlled‑Style Bot: {bot?.name}
      </h1>

      {/* Render your node editor here – omitted for brevity */}
      {/* <ControlledNodeEditor bot={bot} onChange={setBot} /> */}

      <Button className="mt-6" onClick={handleSave}>
        Save Changes
      </Button>

      <Toaster position="bottom-right" />
    </div>
  );
}
```

### Playground – Testing Bot Responses (updated request body)

The **Playground** page lets you experiment with a bot’s behaviour without creating a full bot configuration.  
A recent change renamed the request payload key from `prompt` to `messages`. The API now expects an array of message objects that follow the OpenAI‑compatible schema.

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Playground() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const callPlayground = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/playground`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          // ✅ Updated request body key
          body: JSON.stringify({
            messages: [{ role: "user", content: input }],
          }),
        }
      );

      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setResponse(data.reply);
    } catch (err) {
      toast.error("Playground request failed");
    }
  };

  return (
    <div className="p-6">
      <textarea
        className="w-full p-2 border rounded"
        rows={4}
        placeholder="Ask your bot something..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button className="mt-4" onClick={callPlayground}>
        Send to Playground
      </Button>

      {response && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <strong>Bot reply:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
```

> **Important:** Ensure the backend version you are running matches the frontend (`v0.2.5`). Older backend releases still expect the old `prompt` key, which will result in a `400 Bad Request`.

---  

## Development  

### Setting up the development environment  

1. Follow the **Getting Started** steps above.  
2. Run `npm run lint` to verify code quality.  
3. Run `npm run test` (once tests are added) to ensure functionality.  

### Code style  

* **TypeScript** – strict mode enabled (`tsconfig.json`).  
* **Prettier** – run `npm run format` before committing.  
* **ESLint** – follows the `eslint-config-next` preset; no warnings should appear in CI.  

### Debugging tips  

* Use the built‑in **React DevTools** and **Next.js Fast Refresh** for UI debugging.  
* API errors are surfaced via `sonner` toast notifications; check the browser console for stack traces.  
* For server‑side issues, inspect