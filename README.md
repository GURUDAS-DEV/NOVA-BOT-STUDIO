# Nova Bot Studio  

![Next.js](https://img.shields.io/badge/Next.js-16.0.7-000000?logo=nextdotjs) ![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?logo=tailwindcss) ![License](https://img.shields.io/badge/License-MIT-green) ![GitHub last commit](https://img.shields.io/github/last-commit/GURUDAS-DEV/NOVA-BOT-STUDIO)  

**The ultimate AI‑powered bot platform for automation – design, integrate and manage bots without writing code.**  

[Demo](#) • [Documentation](#) • [Issues](https://github.com/GURUDAS-DEV/NOVA-BOT-STUDIO/issues) • [Pull Requests](https://github.com/GURUDAS-DEV/NOVA-BOT-STUDIO/pulls)

---

## Overview  

Nova Bot Studio is a modern SaaS‑style dashboard built with **Next.js 16** and **TailwindCSS** that lets you:

* **Create** AI chat‑bots in minutes using a drag‑and‑drop UI.  
* **Connect** to popular messaging platforms – Telegram, Discord, Instagram, WhatsApp – or a custom webhook.  
* **Manage** bots, view real‑time statistics and control access from a unified admin panel.  

The platform is fully **client‑side rendered** for a snappy experience, while the backend (hosted separately) provides authentication, bot orchestration and analytics via a REST API.

> **Target audience** – product managers, marketers, community managers, and developers who need a fast way to launch conversational agents without maintaining infrastructure.

Current version: **v0.1.0** (development)

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
| **Export / Import** | JSON export of bot configuration | ✅ Stable |
| **API** | REST endpoints for auth, bot CRUD, analytics | ✅ Stable (backend) |

---

## Tech Stack  

| Layer | Technology | Reason |
|-------|------------|--------|
| **Framework** | **Next.js 16** (React 19) | Server‑side rendering, file‑system routing, API routes |
| **Language** | **TypeScript** | Type safety across the whole stack |
| **Styling** | **TailwindCSS 4**, `tw-animate-css` | Utility‑first styling, fast prototyping |
| **State Management** | **Zustand** | Minimalist global store (`useAuthStore`) |
| **UI Components** | **Radix UI**, `lucide-react`, `react-icons` | Accessible primitives & icons |
| **Theming** | `next-themes` | Dark / Light mode |
| **Animations** | `sonner`, `tw-animate-css` | Toasts & CSS animations |
| **3D** | `three` | Optional 3‑D bot preview |
| **Utilities** | `clsx`, `class-variance-authority`, `dotenv` | Class handling & env loading |
| **Email** | `resend` | Transactional email (e.g., password reset) |
| **Testing / Linting** | `eslint`, `eslint-config-next` | Code quality |
| **Build** | `next build` (Vercel ready) | Optimized production bundles |

---

## Architecture  

```
src/
├─ app/
│  ├─ (private)      ← Auth‑protected UI (dashboard)
│  │   ├─ layout.tsx      ← Global layout with Sidebar & TopBar
│  │   ├─ Sidebar.tsx     ← Collapsible navigation
│  │   ├─ TopBar.tsx      ← User menu, theme switch, notifications
│  │   └─ home/…          ← Home page, stats, quick‑start cards
│  ├─ (public)       ← Public‑facing pages (landing, FAQ, pricing)
│  │   └─ Footer.tsx
│  └─ page.tsx       ← Root page (redirects based on auth)
├─ components/
│  └─ ui/            ← Re‑usable UI primitives (Button, Spinner, …)
├─ lib/
│  ├─ Store/         ← Zustand stores (auth, bot data)
│  ├─ Types/         ← TypeScript interfaces
│  └─ utils.ts       ← Helper functions (API wrappers, formatters)
└─ proxy.ts          ← API‑proxy for server‑side requests (if needed)
```

* **Routing** – Next.js file‑system routing separates public and private routes using the `(public)` and `(private)` folders.  
* **Auth** – `useAuthStore` holds `isLoggedIn`, `userId`, `username`, `email` and provides `refreshUser`/`logout`.  
* **Environment** – `NEXT_PUBLIC_API_BASE_URL` points to the backend API (e.g., `https://api.nova-bot.studio`).  
* **Styling** – Global Tailwind config lives in `tailwind.config.js` (generated by `@tailwindcss/postcss`).  

---

## Getting Started  

### Prerequisites  

| Tool | Minimum version |
|------|-----------------|
| **Node.js** | 20.x |
| **npm** | 10.x (or `pnpm`/`yarn` – same commands) |
| **Git** | any recent version |
| **Vercel CLI** (optional) | 32.x for local Vercel preview |

You also need an **API backend** (not part of this repo) that implements the authentication and bot endpoints. The backend URL must be provided via `NEXT_PUBLIC_API_BASE_URL`.

### Installation  

```bash
# 1️⃣ Clone the repository
git clone https://github.com/GURUDAS-DEV/NOVA-BOT-STUDIO.git
cd NOVA-BOT-STUDIO

# 2️⃣ Install dependencies
npm ci   # or `pnpm install` / `yarn install`

# 3️⃣ Create an .env file (see below)
cp .env.example .env.local
```

### Configuration  

Create a `.env.local` file at the project root:

```dotenv
# Public – injected into the client bundle
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com

# Private – used only by server‑side code (if any)
# Example: secret key for Resend email service
RESEND_API_KEY=your_resend_api_key
```

> **Note**: `NEXT_PUBLIC_` prefix is required for any variable accessed on the client side.

### Verify the installation  

```bash
npm run dev
```

Open <http://localhost:3000> – you should see the public landing page. After logging in (or using the mock auth flow), you’ll be redirected to the dashboard.

---

## Usage  

### Development workflow  

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the Next.js dev server (`http://localhost:3000`) with hot‑reloading. |
| `npm run build` | Produces an optimized production build in `.next`. |
| `npm start` | Runs the production build locally (`NODE_ENV=production`). |
| `npm run lint` | Lints the codebase using ESLint (Next.js config). |

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

### UI navigation  

* **Sidebar** – Click any navigation item (`Home`, `Create Bots`, `Manage Bots`, `Integrations`) to load the corresponding page.  
* **TopBar** – Access user menu (profile, settings, logout) and toggle dark/light mode.  
* **Responsive** – The layout collapses to a hamburger menu on screens < 768 px.

### Screenshots  

| Landing page | Dashboard |
|---|---|
| ![Landing](public/LandingPageImage1.png) | ![Dashboard](public/LandingPageImage2.png) |

*(Images are stored in `public/` – they render automatically when the app runs.)*

---

## Development  

### Setting up the local environment  

```bash
# Install husky pre‑commit hooks (optional)
npx husky install
```

### Running tests  

> The repository currently contains no unit tests, but you can add Jest or Playwright. Example command:

```bash
npm run test   # (add a script in package.json when tests are added)
```

### Code style  

* **ESLint** – Enforced via `npm run lint`.  
* **Prettier** – Recommended – add a `.prettierrc` if you want automatic formatting.  

### Debugging tips  

* Use the browser devtools to inspect the Zustand store (`window.__ZUSTAND_DEVTOOLS__` if you enable it).  
* API requests include `credentials: "include"` – make sure your backend sets proper CORS headers (`Access-Control-Allow-Credentials: true`).  

---

## Deployment  

### Vercel (recommended)  

1. Push the repository to GitHub.  
2. Import the project in the Vercel dashboard.  
3. Set the environment variable `NEXT_PUBLIC_API_BASE_URL` in Vercel → Settings → Environment Variables.  
4. Deploy – Vercel will run `npm install && npm run build` automatically.

### Docker (alternative)  

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
```

Build & run:

```bash
docker build -t nova-bot-studio .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_BASE_URL=https://api.example.com nova-bot-studio
```

### Performance considerations  

* Enable **image optimization** (`next/image`) – already used for the logo.  
* Use **incremental static regeneration** for public pages if you add them later.  
* Keep the **Zustand store** minimal; large objects can cause unnecessary re‑renders.

---

## API Documentation  

The front‑end communicates with a separate backend API. Below are the most common endpoints used by the UI.

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/auth/me` | Returns current user profile (`username`, `email`, `id`). | ✅ Session cookie |
| `POST` | `/api/auth/logout` | Destroys the session and clears cookies. | ✅ Session cookie |
| `GET` | `/api/bots` | List all bots owned by the authenticated user. | ✅ Session cookie |
| `POST` | `/api/bots` | Create a new bot (payload: `name`, `platform`, `template`). | ✅ Session cookie |
| `GET` | `/api/bots/:id` | Retrieve bot details, stats, and configuration. | ✅ Session cookie |
| `PATCH` | `/api/bots/:id` | Update bot settings (e.g., webhook URL, AI model). | ✅ Session cookie |
| `DELETE` | `/api/bots/:id` | Delete a bot permanently. | ✅ Session cookie |

**Authentication** – The UI uses **cookie‑based sessions** (`credentials: "include"`). Ensure the backend sets `SameSite=None; Secure` for cross‑origin usage (e.g., Vercel preview).

**Error handling** – All responses follow the shape:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Detailed error description"
  }
}
```

The front‑end displays errors via `sonner` toast notifications.

---

## Contributing  

We welcome contributions! Follow these steps:

1. **Fork** the repository and clone your fork.  
2. Create a feature branch: `git checkout -b feat/awesome-feature`.  
3. Install dependencies (`npm ci`) and make your changes.  
4. Run the linter (`npm run lint`) – fix any warnings.  
5. Commit with a clear message and push to your fork.  
6. Open a **Pull Request** against `main`.  

### Development workflow  

| Step | Command |
|------|---------|
| Install dependencies | `npm ci` |
| Run dev server | `npm run dev` |
| Lint code | `npm run lint` |
| Build production | `npm run build` |

### Code review guidelines  

* Keep UI components **atomic** – place reusable pieces in `src/components/ui`.  
* Add **TypeScript types** for any new data structures in `src/lib/Types`.  
* Write **unit tests** for new utility functions.  
* Update the **README** if you add public‑facing features or environment variables.  

---

## Troubleshooting  

| Issue | Solution |
|-------|----------|
| **Cannot login / 401 on API calls** | Verify that `NEXT_PUBLIC_API_BASE_URL` points to the correct backend and that the backend is sending `Set-Cookie` with the session token. |
| **Tailwind styles not applying** | Ensure `tailwind.config.js` includes the `src/**/*.{js,ts,jsx,tsx}` paths and that `globals.css` imports `@tailwind base; @tailwind components; @tailwind utilities;`. |
| **Sidebar stays collapsed after refresh** | The sidebar state is stored in component state only; refresh resets it. Consider persisting the state in `localStorage` if needed. |
| **Build fails with “Module not found: react”** | Run `npm ci` again to reinstall exact versions defined in `package-lock.json`. |
| **Icons not showing** | Verify that `react-icons` is installed (`npm i react-icons`) and that the icon component name matches the library import. |

For more help, open an issue or join the discussion in the **GitHub Discussions** tab.

---

## Roadmap  

- **v1.0 (Q3 2026)** – Public release with full authentication, billing integration, and webhook testing console.  
- **AI Model Marketplace** – Allow users to select from OpenAI, Anthropic, or self‑hosted LLMs.  
- **Analytics Dashboard** – Real‑time charts for message volume, user retention, and latency.  
- **Team Collaboration** – Role‑based access (admin, editor, viewer).  
- **Mobile‑first UI** – Optimized layout for tablets and smartphones.  

---

## License & Credits  

**License:** MIT © 2026 Gurudas Bhardwaj. See the [LICENSE](LICENSE) file for details.  

### Contributors  

| Avatar | Name | GitHub |
|--------|------|--------|
| ![gurudas](https://github.com/GURUDAS-DEV.png?size=40) | Gurudas Bhardwaj | [GURUDAS-DEV](https://github.com/GURUDAS-DEV) |

### Acknowledgments  

* **Radix UI