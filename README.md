# Nova Bot Studio  

![Next.js](https://img.shields.io/badge/Next.js-16.0.7-000000?logo=nextdotjs) ![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?logo=tailwindcss) ![Docker](https://img.shields.io/badge/Docker-✓-2496ED?logo=docker) ![License](https://img.shields.io/badge/License-MIT-green) ![GitHub last commit](https://img.shields.io/github/last-commit/GURUDAS-DEV/NOVA-BOT-STUDIO) ![CI](https://github.com/GURUDAS-DEV/NOVA-BOT-STUDIO/actions/workflows/ci.yml/badge.svg)  

**The ultimate AI‑powered bot platform for automation – design, integrate and manage bots without writing code.**  

[Demo](#) • [Documentation](#) • [Issues](https://github.com/GURUDAS-DEV/NOVA-BOT-STUDIO/issues) • [Pull Requests](https://github.com/GURUDAS-DEV/NOVA-BOT-STUDIO/pulls)

---  

## Overview  

Nova Bot Studio is a modern SaaS‑style dashboard built with **Next.js 16** and **TailwindCSS** that lets you:

* **Create** AI chat‑bots in minutes using a drag‑and‑drop visual flow editor.  
* **Connect** to popular messaging platforms – Telegram, Discord, Instagram, WhatsApp – or a custom webhook.  
* **Manage** bots, view real‑time statistics and control access from a unified admin panel.  

The platform is fully **client‑side rendered** for a snappy experience, while a separate backend provides authentication, bot orchestration and analytics via a REST API.

> **Target audience** – product managers, marketers, community managers, and developers who need a fast way to launch conversational agents without maintaining infrastructure.

**Current version:** `v0.2.1` (development)

---  

## Features  

| Category | Feature | Status |
|----------|---------|--------|
| **Bot Builder** | Visual flow editor with pre‑built templates | ✅ Stable |
| | AI response generation (OpenAI / Claude integration) | 🟡 Beta |
| **Integrations** | Telegram, Discord, Instagram, WhatsApp | ✅ Stable |
| | Custom webhook (any HTTP endpoint) | ✅ Stable |
| **Dashboard** | Real‑time bot statistics (messages, uptime, active bots) | ✅ Stable |
| | Multi‑tenant user management (role‑based) | 🟡 Beta |
| **Theming** | Dark / Light mode powered by `next-themes` | ✅ Stable |
| **Notifications** | Toast notifications via `sonner` | ✅ Stable |
| **Animations** | UI transitions with `radix-ui` and `tw-animate-css` | ✅ Stable |
| **3D Preview** | Interactive 3‑D bot avatar using `three` | 🟡 Experimental |
| **Export / Import** | JSON export/import of bot configurations | ✅ Stable |
| **API** | REST endpoints for auth, bot CRUD, analytics (backend) | ✅ Stable |
| **Bot Config Editor** | Full‑screen “Edit Bot Config – Website FreeStyle” UI for per‑bot HTML/CSS/JS customization | ✅ Stable |
| **Deployment** | One‑click Vercel deployment & Docker support | ✅ Stable |
| **Analytics** | Built‑in usage analytics visualised in the dashboard | ✅ Stable |
| **Internationalisation** | Basic i18n support for UI strings | 🟡 Beta |
| **API Keys Management** | Centralised UI for managing platform‑specific API keys (now uses React Suspense for lazy loading) | ✅ Stable |

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
│  │   │   ├─ API_Keys/
│  │   │   │   └─ page.tsx    ← API keys management (uses Suspense)
│  │   │   └─ Edit-Bot-Config/
│  │   │       └─ Website/
│  │   │           └─ FreeStyle/
│  │   │               └─ (id)/
│  │   │                   └─ page.tsx   ← “Edit Bot Config – Website FreeStyle”
│  │   └─ …                    ← Other private sections (create, manage, stats)
│  ├─ (public)       ← Public‑facing pages (landing, FAQ, pricing)
│  │   └─ Footer.tsx
│  └─ page.tsx       ← Root page (redirects based on auth)
├─ components/
│  └─ ui/            ← Re‑usable UI primitives (Button, Card, Spinner, …)
├─ lib/
│  ├─ Store/         ← Zustand stores (auth, bot data)
│  ├─ Types/         ← TypeScript interfaces
│  ├─ analytics/     ← Analytics helpers
│  └─ utils.ts       ← API wrappers, formatters, misc helpers
└─ proxy.ts          ← Optional API‑proxy for server‑side requests
```

* **Routing** – Next.js file‑system routing separates public and private routes using the `(public)` and `(private)` folders.  
* **Auth** – `useAuthStore` holds `isLoggedIn`, `userId`, `username`, `email` and provides helpers like `refreshUser` and `logout`.  
* **Environment** – `NEXT_PUBLIC_API_BASE_URL` points to the backend API (e.g., `https://api.nova-bot.studio`).  
* **API Keys Page** – The new implementation wraps the key‑cards in a `Suspense` boundary, showing a spinner while the platform list loads. This improves perceived performance and keeps the UI responsive.

---  

## Installation  

### Prerequisites  

| Tool | Minimum version |
|------|-----------------|
| **Node.js** | 20.x |
| **npm** | 10.x (or `pnpm` / `yarn`) |
| **Git** | any recent version |
| **Vercel CLI** (optional) | 32.x for local preview |
| **Docker** (optional) | 24.x for containerised dev |

A running **backend API** that implements authentication, bot CRUD and analytics is required. Supply its URL via `NEXT_PUBLIC_API_BASE_URL`.

### Steps  

```bash
# 1️⃣ Clone the repository
git clone https://github.com/GURUDAS-DEV/NOVA-BOT-STUDIO.git
cd NOVA-BOT-STUDIO

# 2️⃣ Install dependencies
npm ci   # or `pnpm install` / `yarn install`

# 3️⃣ Copy the example environment file
cp .env.example .env.local

# 4️⃣ Edit .env.local (see below) and then start the dev server
npm run dev
```

### Configuration  

Create (or edit) `.env.local` at the project root:

```dotenv
# Public – injected into the client bundle
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com

# Private – used only by server‑side code (if any)
RESEND_API_KEY=your_resend_api_key
```

> **Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. All other variables remain server‑only.

### Verify  

```bash
npm run dev
```

Open <http://localhost:3000>. You should see the public landing page. After logging in (or using the mock auth flow), you’ll be redirected to the dashboard where the **API Keys** section now loads its platform cards lazily with a spinner.

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

### Example: Creating a bot (client side)

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const CreateBot = () => {
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bots`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "My First Bot",
          platform: "telegram",
          template: "customer-support",
        }),
      }
    );

    if (res.ok) {
      // Refresh UI or navigate to the bot detail page
      window.location.href = "/home/manage";
    } else {
      const err = await res.json();
      console.error("Bot creation failed:", err);
    }
    setLoading(false);
  };

  return (
    <Button onClick={handleCreate} disabled={loading}>
      {loading ? "Creating…" : "Create Bot"}
    </Button>
  );
};
```

### Example: Managing API keys (new Suspense‑based page)

```tsx
import { Suspense } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

const PlatformCard = ({ platform }) => (
  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
    <CardHeader>
      <platform.icon className={platform.color + " text-2xl"} />
      <CardTitle>{platform.name}</CardTitle>
      <CardDescription>{platform.description}</CardDescription>
    </CardHeader>
  </Card>
);

export default function APIKeysPage() {
  return (
    <Suspense fallback={<Spinner className="mx-auto my-8" />}>
      {/* Platform data is fetched inside the component; while loading the spinner shows */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Example platform list – actual data comes from the backend */}
        {platforms.map(p => (
          <PlatformCard key={p.id} platform={p} />
        ))}
      </div>
    </Suspense>
  );
}
```

> The page now displays a loading spinner while the list of platforms (Website, Discord, Telegram, Instagram, WhatsApp) is being fetched, providing a smoother UX.

### Example: Editing a website bot’s FreeStyle configuration

```tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function EditFreeStylePage() {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const [config, setConfig] = useState({ html: "", css: "", js: "" });
  const [saving, setSaving] = useState(false);

  // Load existing config
  useEffect(() => {
    if (!id) return;
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bots/${id}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => setConfig(data.freeStyle || { html: "", css: "", js: "" }));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bots/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ freeStyle: config }),
    });
    setSaving(false);
    router.push("/home/manage");
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Edit FreeStyle – Bot {id}</h1>

      <textarea
        className="w-full h-40 p-2 border rounded"
        placeholder="HTML"
        value={config.html}
        onChange={(e) => setConfig({ ...config, html: e.target.value })}
      />
      <textarea
        className="w-full h-40 p-2 border rounded"
        placeholder="CSS"
        value={config.css}
        onChange={(e) => setConfig({ ...config, css: e.target.value })}
      />
      <textarea
        className="w-full h-40 p-2 border rounded"
        placeholder="JS"
        value={config.js}
        onChange={(e) => setConfig({ ...config, js: e.target.value })}
      />

      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving…" : "Save Changes"}
      </Button>
    </div>
  );
}
```

---  

## API Documentation  

All API calls are made to the URL defined in `NEXT_PUBLIC_API_BASE_URL`. The backend expects **session cookies** for authentication (the frontend sends `credentials: "include"`).

### 1️⃣ Get API keys for all bots (Website platform)

**Endpoint**

```
GET /api/APIKeyManagement/GetApiKeyForAllBots
```

**Response (200)**

```json
{
  "bots": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "userId": "user_123",
      "name": "Support Bot",
      "botDescription": "Handles FAQ",
      "platform": "Website",
      "status": "active",
      "createdAt": "2024-09-01T12:34:56.789Z",
      "lastUsed": "2024-09-10T08:15:30.123Z",
      "requestCount": 1245
    }
    // …more bots
  ]
}
```

### 2️⃣ Generate a new API key for a specific website bot

**Endpoint**

```
POST /api/APIKeyManagement/GenerateNewApiKeyForWebsite
```

**Request Body**

```json
{
  "botId": "64f1a2b3c4d5e6f7a8b9c0d1"
}
```

**Response (200)**

```json
{
  "apiKey": "newly-generated-api-key-1234567890abcdef"
}
```

### Error Responses (common)

| Code | Reason |
|------|--------|
| 401 | Not authenticated |
| 400 | Bad request / missing parameters |
| 500 | Server error |

*All other backend endpoints