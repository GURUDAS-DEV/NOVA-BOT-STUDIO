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

The platform runs **client‑side rendered** for a snappy UI, while a separate backend provides authentication, bot orchestration and analytics via a REST API.

> **Target audience** – product managers, marketers, community managers, and developers who need a fast way to launch conversational agents without maintaining infrastructure.

**Current version:** `v0.2.2` (development)

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
| **API Keys Management** | Centralised UI for managing platform‑specific API keys (React Suspense lazy loading) | ✅ Stable |
| **Playground** | Private sandbox page for rapid UI prototyping and testing new components | 🟡 Experimental |

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
│  │   │   ├─ Playground/
│  │   │   │   └─ page.tsx    ← Sandbox for rapid UI experiments
│  │   │   ├─ API_Keys/
│  │   │   │   └─ page.tsx    ← API keys management (Suspense‑based)
│  │   │   └─ Edit‑Bot‑Config/
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
│  ├─ posthog.ts
│  └─ utils.ts       ← API wrappers, formatters, misc helpers
└─ proxy.ts          ← Optional API‑proxy for server‑side requests
```

* **Routing** – Next.js file‑system routing separates public and private routes using the `(public)` and `(private)` folders.  
* **Auth** – `useAuthStore` holds `isLoggedIn`, `userId`, `username`, `email` and provides helpers like `refreshUser` and `logout`.  
* **Environment** – `NEXT_PUBLIC_API_BASE_URL` points to the backend API (e.g., `https://api.nova-bot.studio`).  

---  

## Installation  

### Prerequisites  

| Tool | Minimum version |
|------|-----------------|
| **Node.js** | 20.x |
| **npm** | 10.x (or `pnpm` / `yarn`) |
| **Git** | any recent version |
| **Docker** (optional) | 24.x for containerised dev |
| **Vercel CLI** (optional) | 32.x for local preview |

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
```

> **Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. All other variables remain server‑only.

### Verify  

```bash
npm run dev
```

Open <http://localhost:3000>. You should see the public landing page. After logging in, you’ll be redirected to the dashboard. Navigate to **Playground** (`/home/Playground`) to view the sandbox page.

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

### Example: Managing API keys (Suspense‑based page)

```tsx
import { Suspense } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
        {platforms.map((p) => (
          <PlatformCard key={p.id} platform={p} />
        ))}
      </div>
    </Suspense>
  );
}
```

### Example: Using the **Playground** sandbox

```tsx
// src/app/(private)/home/Playground/page.tsx
export default function Playground() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Playground</h1>
      <p className="text-gray-600">
        This area is reserved for rapid UI prototyping. Add your experimental
        components here and they will be isolated from the production dashboard.
      </p>

      {/* Example: render a temporary component */}
      {/* <MyExperimentalWidget /> */}
    </div>
  );
}
```

Navigate to `/home/Playground` after login to view the page. Replace the placeholder markup with any component you wish to test.

---  

## API Documentation  

> The front‑end communicates with a separate backend service. The backend’s OpenAPI spec lives in its own repository. Below are the most‑used endpoints from the front‑end perspective.

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/login` | Authenticate a user and set an HTTP‑only session cookie. | ❌ |
| `GET` | `/api/bots` | Retrieve a list of bots owned by the authenticated user. | ✅ |
| `POST` | `/api/bots` | Create a new bot (name, platform, template). | ✅ |
| `GET` | `/api/bots/:id` | Get detailed configuration for a specific bot. | ✅ |
| `PATCH` | `/api/bots/:id` | Update bot configuration (including FreeStyle HTML/CSS/JS). | ✅ |
| `DELETE` | `/api/bots/:id` | Delete a bot. | ✅ |
| `GET` | `/api/analytics/:botId` | Fetch usage statistics for a bot (messages, uptime, etc.). | ✅ |
| `GET` | `/api/platforms` | List available messaging platforms for API‑key management. | ✅ |

*All authenticated requests must include the session cookie (`credentials: "include"`).*

---  

## Contributing  

We welcome contributions! Please follow these steps:

1. **Fork** the repository and clone your fork.  
2. **Create a feature branch** (`git checkout -b feat/playground-demo`).  
3. **Install dependencies** and set up the environment as described in the Installation section.  
4. **Make your changes** – ensure they pass linting and any existing tests.  
5. **Write tests** for new functionality when applicable.  
6. **Commit** using Conventional Commits (`feat: add playground demo`).  
7. **Push** to your fork and open a Pull Request against `main`.  

### Development workflow  

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start local dev server with hot‑reload. |
| `npm run lint` | Run ESLint. |
| `npm run format` | Run Prettier. |
| `npm run test` | Execute test suite. |
| `npm run build` | Build production assets. |

### Code style  

* **Linting** – `npm run lint` (