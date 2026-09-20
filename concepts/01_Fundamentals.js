/*
============================================================
NEXT.JS REVISION
============================================================

Focus:
- Next.js fundamentals
- App Router mental model
- Project structure
- Core file conventions
- Server-first architecture
- Rendering basics
- Runtime & environment
- Essential interview points

*/


// ============================================================
// 01. WHAT IS NEXT.JS?
// ============================================================

// React → UI library
// Next.js → React framework for full-stack applications

/*
Next.js provides:

- File-based routing
- Server Components
- Client Components
- Server Functions
- Data fetching
- Caching
- Route Handlers / APIs
- Rendering strategies
- Image / Font optimization
- Metadata
- Production tooling
*/


// ============================================================
// 02. CREATE A NEXT.JS PROJECT
// ============================================================

// npm
// npx create-next-app@latest my-app

// pnpm
// pnpm create next-app@latest my-app

// Common setup:
// ✓ TypeScript
// ✓ ESLint
// ✓ Tailwind CSS
// ✓ App Router
// ✓ src/ directory (optional)


// ============================================================
// 03. BASIC PROJECT STRUCTURE
// ============================================================

/*
my-app/
│
├── app/
│   ├── layout.js
│   ├── page.js
│   ├── globals.css
│   └── ...
│
├── public/
├── components/
├── lib/
│
├── .env.local
├── next.config.js
├── package.json
└── jsconfig.json / tsconfig.json
*/

/*
app/
→ Routes + route-specific UI

public/
→ Static files

components/
→ Reusable UI components

lib/
→ Utilities, database, services, server-side logic

.env.local
→ Local environment variables

next.config.js
→ Next.js configuration

package.json
→ Dependencies + scripts
*/


// ============================================================
// 04. APP ROUTER
// ============================================================

// Modern Next.js → App Router
// App Router uses the app/ directory.

/*
app/
├── page.js
├── about/
│   └── page.js
└── dashboard/
    └── page.js
*/

/*
URL:

app/page.js
→ /

app/about/page.js
→ /about

app/dashboard/page.js
→ /dashboard
*/


// ============================================================
// 05. PAGE
// ============================================================

// page.js creates the UI for a route.

export default function HomePage() {
  return <h1>Home Page</h1>;
}

// app/page.js
// → /


// ============================================================
// 06. LAYOUT
// ============================================================

// layout.js = shared UI around child routes

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

/*
Example:

app/
├── layout.js
├── page.js
└── dashboard/
    ├── layout.js
    └── page.js

Root layout
    ↓
Dashboard layout
    ↓
Dashboard page
*/


// ============================================================
// 07. IMPORTANT SPECIAL FILES
// ============================================================

/*
page.js
→ Route UI

layout.js
→ Shared/persistent UI

loading.js
→ Loading UI

error.js
→ Error UI / Error Boundary

not-found.js
→ 404 UI

template.js
→ Similar to layout but remounts on navigation
*/


// ============================================================
// 08. loading.js
// ============================================================

// app/dashboard/loading.js

export default function Loading() {
  return <p>Loading...</p>;
}

// Used while the route's content is loading.
// Useful with streaming/Suspense-based rendering.


// ============================================================
// 09. error.js
// ============================================================

// app/dashboard/error.js

"use client";

export default function Error({ error, reset }) {
  return (
    <div>
      <p>Something went wrong.</p>

      <button onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}

// error.js acts as a route-level error boundary.
// It must be a Client Component.


// ============================================================
// 10. not-found.js
// ============================================================

// app/products/[id]/not-found.js

export default function NotFound() {
  return <h1>Product not found</h1>;
}

// Used when a resource/route should return a 404 UI.


// ============================================================
// 11. SERVER COMPONENTS BY DEFAULT
// ============================================================

// In App Router, components are Server Components by default.

export default async function ProductsPage() {
  const res = await fetch("https://api.example.com/products");
  const products = await res.json();

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}

/*
Server Component can:

✓ Fetch data on the server
✓ Access server-side resources
✓ Keep secrets on the server
✓ Reduce client-side JavaScript

Server Component cannot directly use:

✗ useState
✗ useEffect
✗ onClick
✗ browser APIs
*/


// ============================================================
// 12. CLIENT COMPONENT
// ============================================================

// Add "use client" at the top.

"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}

/*
Client Component is needed for:

- useState
- useEffect
- Event handlers
- Browser APIs
- Client-side interactivity
*/


// ============================================================
// 13. SERVER → CLIENT COMPONENT
// ============================================================

// Server Component

import Counter from "./Counter";

export default function Page() {
  return (
    <main>
      <h1>Dashboard</h1>
      <Counter />
    </main>
  );
}

/*
Keep the page/server logic on the server
and use Client Components only where interaction is needed.
*/


// ============================================================
// 14. "use client" CREATES A CLIENT BOUNDARY
// ============================================================

/*
"use client" does NOT mean:

"Make only this function run in browser."

It marks that module and its imported component tree
as part of the client bundle.

So avoid putting "use client" unnecessarily high
in the component tree.
*/


// ============================================================
// 15. SERVER-ONLY CODE
// ============================================================

// For example:

// lib/db.js

import "server-only";

export async function getUsers() {
  // database query
}

// Prevent accidental usage of server-only code
// inside Client Components.


// ============================================================
// 16. SERVER-FIRST MENTAL MODEL
// ============================================================

/*
                    Next.js App
                        │
                ┌───────┴───────┐
                │               │
             Server           Client
           Components       Components
                │               │
        DB / API / Secrets   State / Events
                │               │
                └───────┬───────┘
                        ↓
                     Browser
*/


// ============================================================
// 17. RENDERING BASICS
// ============================================================

/*
Static Rendering
→ Output can be generated/cached ahead of time.

Dynamic Rendering
→ Output depends on request-time information.

Streaming
→ UI can be sent progressively instead of waiting
  for the entire page.
*/

/*
Common idea:

Static
→ Fast, cache-friendly

Dynamic
→ Request-specific data

Streaming
→ Better perceived loading for slow parts
*/


// ============================================================
// 18. SSR vs SSG vs ISR — INTERVIEW REVISION
// ============================================================

/*
SSR
→ Render on the server for a request.

SSG
→ Generate output ahead of time.

ISR
→ Static output can be regenerated/revalidated.

Modern App Router:
Don't treat these as completely separate APIs.
Next.js decides rendering/caching based on the route,
data and configuration.
*/


// ============================================================
// 19. NODE.JS vs BROWSER
// ============================================================

/*
Server / Node.js:

✓ Database access
✓ File system
✓ Environment secrets
✓ Server-side APIs

Browser:

✓ DOM
✓ window
✓ localStorage
✓ User interaction

Server Components run on the server.
Client Components can execute in the browser.
*/


// ============================================================
// 20. RUNTIME
// ============================================================

// Next.js server code can use different runtimes.

// Node.js Runtime
// → Full Node.js environment
// → General backend/server use

// Edge Runtime
// → Lightweight runtime
// → Useful for certain low-latency/server-edge use cases
// → Has different API limitations

// Use Node.js unless Edge is actually required.


// ============================================================
// 21. ENVIRONMENT VARIABLES
// ============================================================

// .env.local

// DATABASE_URL="mongodb://..."
// JWT_SECRET="secret"
// NEXT_PUBLIC_API_URL="https://example.com"


// Server-only variable:
const dbUrl = process.env.DATABASE_URL;

// Public variable:
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

/*
IMPORTANT:

DATABASE_URL
→ Server only

NEXT_PUBLIC_API_URL
→ Can be exposed to browser

Never put secrets in NEXT_PUBLIC_*.
*/


// ============================================================
// 22. NEXT.JS CONFIG
// ============================================================

// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;

// Modern projects may use next.config.mjs / next.config.ts
// depending on project setup.


// ============================================================
// 23. NEXT.JS COMMANDS
// ============================================================

// Development
// npm run dev

// Production build
// npm run build

// Start production server
// npm run start

/*
Typical flow:

Development:
npm run dev

Production:
npm run build
npm run start
*/


// ============================================================
// 24. NEXT.JS REQUEST / APPLICATION FLOW
// ============================================================

/*
Browser
   ↓
URL
   ↓
Next.js Router
   ↓
Route
   ↓
Server Component / Client Component
   ↓
Data / Server Logic
   ↓
Rendered UI
   ↓
Browser
*/

/*
Later files cover:

Routing
→ 02

Server/Client architecture
→ 03

Data + caching
→ 04

Server Functions
→ 05

APIs/backend
→ 06
*/


// ============================================================
// 25. IMPORTANT MODERN NEXT.JS FEATURES
// ============================================================

// Know these names; detailed usage comes later.

/*
- App Router
- React Server Components
- Server Functions
- Cache Components
- "use cache"
- proxy.js / proxy.ts
- Turbopack
- React Compiler
*/

/*
Do NOT memorize implementation details here.

Understand what problem each feature solves.
*/


// ============================================================
// 26. FUNDAMENTALS — QUICK RECALL
// ============================================================

/*
Next.js
→ React framework for full-stack applications

App Router
→ app/ based routing system

page.js
→ Route UI

layout.js
→ Shared/persistent UI

loading.js
→ Loading state

error.js
→ Error boundary

not-found.js
→ 404 UI

Server Component
→ Default in App Router

Client Component
→ "use client"

Server
→ DB / secrets / server resources

Browser
→ Events / state / browser APIs

.env
→ Environment configuration

NEXT_PUBLIC_*
→ Browser-exposed environment variable
*/


// ============================================================
// INTERVIEW QUICK REVIEW
// ============================================================

/*
Q1. What is Next.js?

A:
Next.js is a React framework for building full-stack web
applications with routing, rendering, server-side features,
data fetching, APIs and production optimizations.


Q2. What is the App Router?

A:
The modern Next.js routing system based on the app/ directory.


Q3. What is page.js?

A:
It defines the UI for a route.


Q4. What is layout.js?

A:
It provides shared UI around child routes and can preserve
layout state during navigation.


Q5. What are Server Components?

A:
Components that render on the server by default in the App
Router and can access server-side resources without sending
their component JavaScript to the browser.


Q6. When do you use "use client"?

A:
When a component needs client-side features such as state,
effects, event handlers or browser APIs.


Q7. Why shouldn't "use client" be added everywhere?

A:
It increases the client-side JavaScript boundary and can
unnecessarily move components/work to the client.


Q8. Can a Server Component use useState?

A:
No. useState is a client-side React feature.


Q9. Can a Server Component access a database?

A:
Yes. Server Components can perform server-side data access.


Q10. Where should database secrets be kept?

A:
On the server, typically through environment variables.
They must not be exposed through NEXT_PUBLIC_* variables.


Q11. What is the difference between static and dynamic rendering?

A:
Static rendering can be generated/cached ahead of time,
while dynamic rendering depends on request-time information.


Q12. What is streaming?

A:
Sending parts of the UI progressively instead of waiting for
the complete page to finish rendering.


Q13. What is the difference between Node.js and Edge Runtime?

A:
Node.js provides the broader Node.js environment. Edge Runtime
is a more limited runtime designed for code that can execute
closer to users.


Q14. What is error.js used for?

A:
It provides a route-level error boundary and must be a
Client Component.


Q15. What is loading.js used for?

A:
It provides loading UI while route content is being prepared.


Q16. What is not-found.js used for?

A:
It provides the UI shown when a requested resource/route
cannot be found.


Q17. What is the purpose of the public/ directory?

A:
It stores static files that can be served directly by URL.


Q18. What is NEXT_PUBLIC_?

A:
A prefix indicating that an environment variable can be
exposed to client-side code. It must not contain secrets.


Q19. Is Next.js only a frontend framework?

A:
No. It supports frontend UI as well as server-side features,
data access, Server Functions and Route Handlers.


Q20. What is the main architectural idea of modern Next.js?

A:
Keep as much work as possible on the server and move only
interactive parts to the client.
*/


/*
============================================================
END
============================================================
*/

