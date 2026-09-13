```
/*
============================================================
Next.js Fundamentals
============================================================


// ============================================================
// 1. NEXT.JS
// ============================================================

// Next.js = React framework for building full-stack web apps.

// React → UI
// Next.js → UI + Routing + Rendering + Server features + APIs + Optimization

// App Router = modern Next.js routing system.
// Pages Router = older system; still exists for legacy projects.


// ============================================================
// 2. CREATE & RUN
// ============================================================

// Create app:
// npx create-next-app@latest my-app

// Run development server:
// npm run dev

// Production:
// npm run build
// npm start


// ============================================================
// 3. BASIC PROJECT STRUCTURE
// ============================================================

/*
my-app/
│
├── app/              -> routes + app logic
│   ├── layout.js     -> shared/root UI
│   ├── page.js       -> route UI
│   ├── loading.js    -> loading UI
│   ├── error.js      -> error boundary
│   └── not-found.js  -> 404 UI
│
├── public/           -> static assets
├── components/       -> reusable UI
├── lib/              -> utilities/data logic
│
├── next.config.js    -> Next.js config
├── package.json
└── .env.local        -> local environment variables
*/


// ============================================================
// 4. ROUTE BASICS
// ============================================================

// app/page.js
// → "/"

// app/about/page.js
// → "/about"

// app/dashboard/page.js
// → "/dashboard"

// Folder = route segment
// page.js = publicly accessible route UI


// ============================================================
// 5. ROOT LAYOUT
// ============================================================

// app/layout.js

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

// Root layout is required in App Router.
// Shared UI can stay here.
// Example: Navbar, providers, global styles, etc.


// ============================================================
// 6. SPECIAL FILES
// ============================================================

/*
page.js
→ Page UI for a route

layout.js
→ Shared UI around child routes

loading.js
→ Loading/fallback UI

error.js
→ Error boundary for a route segment
→ Must be a Client Component

not-found.js
→ 404 UI

global-error.js
→ Root-level error handling

template.js
→ Similar to layout, but remounts on navigation
*/


// ============================================================
// 7. SERVER-FIRST MODEL
// ============================================================

// App Router uses Server Components by default.

// Server Component:
// - Can access server-side resources
// - Can fetch data directly
// - No browser APIs
// - No useState/useEffect

// Client Component:
// - Browser APIs
// - state
// - effects
// - event handlers

// Use "use client" when a component needs client-side behavior.

/*
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>
    {count}
  </button>;
}
*/


// ============================================================
// 8. SERVER vs BROWSER
// ============================================================

// Server:
// Node.js / server runtime
// Database
// Secrets
// Server-side APIs

// Browser:
// DOM
// localStorage
// window
// user interaction

// Don't expose secrets/API keys to Client Components.


// ============================================================
// 9. RENDERING — QUICK VIEW
// ============================================================

/*
Static:
→ HTML can be generated/cached ahead of time.

Dynamic:
→ Content depends on request/user/runtime data.

Streaming:
→ UI can arrive in parts instead of waiting for everything.

Client rendering:
→ Browser handles interactive UI.
*/

// Detailed rendering + caching → 04 & 08


// ============================================================
// 10. ERROR / LOADING FLOW
// ============================================================

/*
Request
   ↓
page.js
   ↓
Data loading
   ↓
loading.js  -> while loading
   ↓
page rendered

Error
   ↓
error.js

Missing resource
   ↓
notFound()
   ↓
not-found.js
*/


// ============================================================
// 11. NEXT.JS CORE MENTAL MODEL
// ============================================================

/*
App Router
   │
   ├── Routing
   ├── Server Components
   ├── Client Components
   ├── Data Fetching
   ├── Server Functions
   ├── Route Handlers
   ├── Caching
   └── Rendering
*/

// Next.js tries to keep more work on the server
// and send less JavaScript to the browser.


// ============================================================
// INTERVIEW QUICK REVIEW
// ============================================================

// Q1. What is Next.js?
// A: A React framework for building full-stack web applications.

// Q2. React vs Next.js?
// A: React mainly handles UI; Next.js adds routing, rendering,
//    server features, APIs, caching, and production optimizations.

// Q3. What is App Router?
// A: Next.js's modern routing system based on the app/ directory.

// Q4. What is page.js?
// A: It defines the UI for a route.

// Q5. What is layout.js?
// A: Shared UI that wraps child routes.

// Q6. Are components Server or Client by default?
// A: In the App Router, components are Server Components by default.

// Q7. When do you use "use client"?
// A: When the component needs state, effects, event handlers,
//    or browser-only APIs.

// Q8. Can a Server Component use useState?
// A: No.

// Q9. Why prefer Server Components?
// A: They can keep data fetching and server-only logic on the server
//    and reduce client-side JavaScript.

// Q10. What is loading.js?
// A: Route-level loading/fallback UI.

// Q11. What is error.js?
// A: A route-level error boundary for handling rendering errors.

// Q12. What is not-found.js?
// A: UI shown when a requested resource/route is not found.
```;
