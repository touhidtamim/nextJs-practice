/*
==================================================
10. ADVANCED NEXT.JS + INTERVIEW
==================================================
*/



// ==================================================
// 1. ROUTE GROUPS
// ==================================================

/*
Route groups organize routes without changing URL.

app/
├── (marketing)/
│   ├── page.js
│   └── about/
│       └── page.js
└── (dashboard)/
    └── dashboard/
        └── page.js

URL:
(marketing)/about -> /about
(dashboard)/dashboard -> /dashboard

Useful for:
- Organizing large apps
- Separate layouts
*/


// ==================================================
// 2. PRIVATE FOLDERS
// ==================================================

/*
Folder starting with "_"
is treated as a private implementation folder.

app/
├── _components/
├── _lib/
└── page.js

Useful for keeping non-route files
inside the app directory.
*/


// ==================================================
// 3. NESTED LAYOUTS
// ==================================================

// app/dashboard/layout.js

export default function DashboardLayout({ children }) {
  return (
    <div>
      <aside>Sidebar</aside>
      <main>{children}</main>
    </div>
  );
}

/*
Layouts persist while navigating between
their child routes.

Useful for:
- Dashboard sidebar
- Shared navigation
- Persistent UI
*/


// ==================================================
// 4. PARALLEL ROUTES
// ==================================================

/*
Parallel routes allow multiple UI sections
to render independently.

app/dashboard/
├── @analytics/
├── @team/
└── layout.js

Concept:

Dashboard
├── Analytics
└── Team

Useful for complex dashboards where
different sections have independent UI states.
*/


// ==================================================
// 5. INTERCEPTING ROUTES
// ==================================================

/*
Intercepting routes allow a route to be shown
inside the current layout/context.

Common use case:

Product page
   ↓
Click product
   ↓
Open product as modal

while direct URL access can still show
the full product page.

Common convention:

(.)  same level
(..) one level above
(...) root/app level
*/


// ==================================================
// 6. STREAMING + SUSPENSE
// ==================================================

import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SlowComponent />
    </Suspense>
  );
}

/*
Instead of waiting for the whole page,
parts of the UI can become available
as their data/rendering is ready.

Useful for:
- Large pages
- Slow sections
- Better perceived performance
*/


// ==================================================
// 7. generateStaticParams()
// ==================================================

export async function generateStaticParams() {
  const products = await getProducts();

  return products.map((product) => ({
    id: String(product.id),
  }));
}

/*
Used with dynamic routes to generate
known static paths.

Example:

/products/1
/products/2
/products/3
*/


// ==================================================
// 8. READING URL SEARCH PARAMS
// ==================================================

// Server Component

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;

  const query = params.q;

  return <h1>Search: {query}</h1>;
}

/*
URL:

/search?q=react

query = "react"

Useful for:
- Search
- Filters
- Sorting
- Pagination
*/


// ==================================================
// 9. CLIENT URL STATE
// ==================================================

"use client";

import { useSearchParams } from "next/navigation";

export default function SearchInfo() {
  const searchParams = useSearchParams();

  const query = searchParams.get("q");

  return <p>{query}</p>;
}

/*
useSearchParams()
-> read query parameters in Client Components.

For navigation:
useRouter()
usePathname()
*/


// ==================================================
// 10. REDIRECT
// ==================================================

import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return <h1>Dashboard</h1>;
}

/*
redirect()
-> server-side navigation/redirect

Useful when a user should not continue
to the current route.
*/


// ==================================================
// 11. REWRITE vs REDIRECT
// ==================================================

/*
REDIRECT:
Browser URL changes.

 /old
   ↓
 /new


REWRITE:
Browser URL stays the same,
but request is served from another route.

 /api/external
   ↓
 internal route

Remember:

redirect = change URL
rewrite  = hide internal destination
*/


// ==================================================
// 12. NOT FOUND vs REDIRECT
// ==================================================

/*
notFound()
-> resource doesn't exist

redirect()
-> user should go somewhere else

Example:

Product missing
-> notFound()

User not logged in
-> redirect("/login")
*/


// ==================================================
// 13. REQUEST COOKIES
// ==================================================

import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();

  const theme = cookieStore.get("theme");

  return <p>{theme?.value}</p>;
}

/*
cookies()
-> read request cookies on server

Useful for:
- Sessions
- Preferences
- Locale
*/


// ==================================================
// 14. REQUEST HEADERS
// ==================================================

import { headers } from "next/headers";

export default async function Page() {
  const requestHeaders = await headers();

  const userAgent = requestHeaders.get("user-agent");

  return <p>{userAgent}</p>;
}

/*
headers()
-> access request headers on server.
*/


// ==================================================
// 15. CUSTOM 404 PAGE
// ==================================================

// app/not-found.js

export default function NotFound() {
  return <h1>Page Not Found</h1>;
}

/*
Global not-found UI.

Specific routes can also trigger
notFound() when necessary.
*/


// ==================================================
// 16. GLOBAL ERROR
// ==================================================

/*
global-error.js
-> handles errors at the root level.

It is different from:
error.js
-> route-segment level error handling.

Think:

error.js
-> local route boundary

global-error.js
-> root-level fallback
*/


// ==================================================
// 17. MULTI-LAYOUT ARCHITECTURE
// ==================================================

/*
Large application:

app/
├── layout.js
├── (auth)/
│   ├── layout.js
│   ├── login/
│   └── register/
│
└── (app)/
    ├── layout.js
    ├── dashboard/
    └── settings/

Benefits:
- Different layouts
- Cleaner organization
- Shared UI within route groups
*/


// ==================================================
// 18. NEXT.JS REQUEST FLOW
// ==================================================

/*
Browser Request
      ↓
Route Matching
      ↓
Layout
      ↓
Page
      ↓
Server / Client Components
      ↓
Data / API / Database
      ↓
Rendered UI

Remember:
Route structure controls
how the application is composed.
*/


// ==================================================
// 19. SERVER-ONLY MODULE
// ==================================================

import "server-only";

export async function getSecretData() {
  // server-only logic
}

/*
server-only helps prevent accidental
usage of server-only modules in client code.

Useful for:
- Database utilities
- Secrets
- Server-only business logic
*/


// ==================================================
// 20. ENVIRONMENT SAFETY
// ==================================================

/*
.env.local

SECRET_KEY="abc123"

Server:
process.env.SECRET_KEY

Do NOT:

NEXT_PUBLIC_SECRET_KEY="abc123"

NEXT_PUBLIC_* values are exposed to
the client.
*/


// ==================================================
// 21. REUSABLE SERVER DATA LAYER
// ==================================================

/*
Instead of:

Page
 └── Database query

Prefer:

Page
 ↓
Service / lib
 ↓
Database

Example:

// lib/users.js

export async function getUserById(id) {
  return db.user.findUnique({
    where: { id },
  });
}

Then:

import { getUserById } from "@/lib/users";

Keeps database logic separate from UI.
*/


// ==================================================
// 22. NEXT.JS + TYPESCRIPT QUICK REVISION
// ==================================================

type Product = {
  id: string;
  name: string;
  price: number;
};

type ProductProps = {
  product: Product;
};

export default function ProductCard({
  product,
}: ProductProps) {
  return <h2>{product.name}</h2>;
}

/*
Important in interviews/jobs:

Props typing
API response typing
Function return types
Reusable type definitions
*/


// ==================================================
// 23. COMMON MISTAKES
// ==================================================

/*
1. "use client" everywhere
   -> unnecessary client JavaScript

2. Secret inside NEXT_PUBLIC_
   -> exposed to browser

3. Authorization only in UI
   -> insecure

4. Database logic directly inside many components
   -> difficult to maintain

5. Sequential independent requests
   -> unnecessary waiting

6. Using <a> for every internal navigation
   -> lose Next.js navigation benefits

7. Huge Client Components
   -> larger JS bundle

8. Ignoring loading/error states
   -> poor UX
*/


// ==================================================
// 24. INTERVIEW RAPID FIRE
// ==================================================

/*
Q1. What are Route Groups?

A:
Folders like (dashboard) used for organization
without affecting the URL.


Q2. What are Parallel Routes?

A:
A way to render multiple route segments/slots
independently in the same layout.


Q3. What are Intercepting Routes?

A:
They allow a route to be rendered within the
current routing context, commonly for modal patterns.


Q4. What is streaming?

A:
Sending/rendering UI progressively instead of
waiting for the complete page.


Q5. What is generateStaticParams()?

A:
It provides known dynamic route parameters that
can be statically generated.


Q6. redirect() vs notFound()?

A:

redirect()
-> send user to another route

notFound()
-> show not-found UI


Q7. redirect vs rewrite?

A:

redirect:
URL changes.

rewrite:
URL remains the same while another destination
handles the request.


Q8. What does cookies() do?

A:
Reads request cookies in server-side code.


Q9. What does headers() do?

A:
Reads request headers on the server.


Q10. Why use server-only?

A:
To make it explicit that a module must only be
used in server-side code.


Q11. Why avoid "use client" at the top level?

A:
It can unnecessarily move a large component tree
into the client bundle.


Q12. What is the benefit of nested layouts?

A:
Shared UI can persist across navigation within
a route segment.


Q13. What is Suspense used for in Next.js?

A:
To provide fallback UI while part of the UI
is waiting to render/load.


Q14. Where should database logic live?

A:
Prefer a dedicated server-side data/service layer
rather than scattering queries throughout UI.


Q15. What is the difference between authentication
and authorization?

A:

Authentication -> identity
Authorization -> permission


// ==================================================
// FINAL QUICK REVISION
// ==================================================

/*
Advanced Next.js:

Route Groups
    -> organize routes

Private Folders
    -> keep non-route code private

Nested Layouts
    -> persistent shared UI

Parallel Routes
    -> multiple independent UI slots

Intercepting Routes
    -> modal/contextual routing

Suspense / Streaming
    -> progressive UI

generateStaticParams()
    -> static dynamic routes

searchParams
    -> URL query data

redirect()
    -> move user

notFound()
    -> missing resource

rewrite()
    -> serve another destination without
       changing browser URL

cookies()
    -> request cookies

headers()
    -> request headers

server-only
    -> protect server-only modules

Service/Data Layer
    -> separate business/data logic from UI

Golden rule:

Keep routing organized,
server code protected,
UI boundaries small,
and architecture separated.
*/


// ==================================================
// END
// ==================================================
